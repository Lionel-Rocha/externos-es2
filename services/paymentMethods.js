const fetch = require("node-fetch");
const crypto = require("crypto");
const {
    salvarCobranca,
    buscarUltimaCobrancaPendente,
    buscarCobrancasPorUsuario,
    buscarCobrancaPorId,
    buscarCartaoPorCiclista,
    buscarCobrancasPendentes,
    restoresDatabase,
    updateCobrancaStatus
} = require("../repositories/database");

const { obterToken } = require("../middlewares/paymentClient");

// Cria e salva nova cobrança no DB
async function createBill(userId, amount, requestedTime) {
    const accessToken = await obterToken();

    // Cria pedido no PayPal
    const response = await fetch('https://api-m.sandbox.paypal.com/v2/checkout/orders', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
            'PayPal-Request-Id': crypto.randomUUID()
        },
        body: JSON.stringify({
            intent: "CAPTURE",
            purchase_units: [{ amount: { currency_code: "BRL", value: amount.toString() } }]
        })
    });

    const data = await response.json();
    if (!response.ok) throw new Error(`Error creating bill: ${data.message}`);

    // Salva no DB
    const newBill = await salvarCobranca({
        ciclista: userId,
        orderid: data.id,
        value: amount,
        status: 'PENDING',
    });

    return {
        userId,
        orderId: data.id,
        amount: amount.toString(),
        requestedTime,
        createdAt: newBill.date,
        status: newBill.status
    };
}


async function payBillPorOrderId(ciclista, orderid) {
    const accessToken = await obterToken();

    // Busca a cobrança específica
    const bill = await buscarCobrancaPorId(orderid);

    if (!bill) throw new Error("Bill not found");
    if (bill.ciclista !== ciclista) throw new Error("This bill does not belong to the provided user");

    // Verifica se já foi processada
    if (bill.status !== 'PENDING') throw new Error("Bill already processed");

    // Busca dados do cartão
    const card = await buscarCartaoPorCiclista(ciclista);
    if (!card) throw new Error("Credit card not found for user");

    // Formata validade
    const data_cartao = new Date(card.validade);
    const ano = data_cartao.getFullYear();
    const mes = String(data_cartao.getMonth() + 1).padStart(2, '0');
    const validade = `${ano}-${mes}`;

    // Faz o pagamento no PayPal
    const response = await fetch(
        `https://api-m.sandbox.paypal.com/v2/checkout/orders/${orderid}/capture`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
                'PayPal-Request-Id': orderid
            },
            body: JSON.stringify({
                payment_source: {
                    card: {
                        number: card.numero,
                        expiry: validade,
                        security_code: card.codigo_seguranca,
                        name: card.nome_no_cartao
                    }
                }
            })
        }
    );

    const data = await response.json();

    if (!response.ok) throw new Error(`Error capturing bill: ${data.message}`);

    // Atualiza status no banco de dados
    await updateCobrancaStatus(orderid, 'COMPLETED');

    return {
        ciclista,
        orderid,
        amount: bill.value,
        requestedTime: bill.date,
        createdAt: bill.date,
        status: 'COMPLETED',
        paymentDetails: data
    };
}




// Paga a última cobrança pendente de um usuário


// Processa todas as cobranças pendentes
async function paysLateBills() {
    const pending = await buscarCobrancasPendentes();
    const now = new Date();
    const processed = [];
    for (const bill of pending) {

            try {
                const result = await payBillPorOrderId(bill.ciclista, bill.orderid);
                processed.push(result);
            } catch (e) {
                console.error(`Error processing late bill ${bill.orderid}:`, e.message);
        }
    }
    return processed;
}

// Obtém uma cobrança específica
async function getsBill(orderId) {
    const bill = await buscarCobrancaPorId(orderId);
    if (!bill) throw new Error("Bill not found");
    return bill;
}

module.exports = {
    createBill,
    payBillPorOrderId,
    paysLateBills,
    getsBill,
    restoresDatabase
};
