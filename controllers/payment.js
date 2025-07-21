//Foi mal estar tudo em inglês. Acho que é o costume.
//Pareceu esquisito misturar inglês com português.
//Meu supervisor dizia para escolher uma, então escolhi o inglês.

const express = require("express");
const router = express.Router();
const paymentMethods = require("../services/paymentMethods");


//esse treco demora um pouco, porque tem duas coisas acontecendo aqui: a criação da cobrança
//(no paypal) e o pagamento (no paypal)
router.post('/cobranca', async (req, res) => {
    let {valor, ciclista} = req.body;
    const now = new Date();
    const requestedTime = now.toLocaleString('pt-BR');

    let payment;
    let bill;
    try{
        bill = await paymentMethods.createBill(ciclista, valor, requestedTime);
        try {
            payment = await paymentMethods.payBill(ciclista);
            if (!payment) {
                //não faz nada; a bill continua "PENDING"
                res.send(500).send("Pending bill.");
            }
        } catch (e) {
            if (e.message.includes("User not found")) {
                return res.status(422).send("Dados inválidos.");
            }
            res.send(500).send("Internal Server Error: " + e.message);
        }
    } catch(e){
        return res.status(500).send("Internal Server Error: " + e.message);
    }

    const endTime = now.toLocaleString('pt-BR', );

    res.status(200).send( {
        message: "Cobrança solicitada",
        valor: valor,
        ciclista: ciclista,
        horaSolicitacao: bill.requestedTime,
        horaFinalizacao: endTime,
        id: bill.orderId,
        status: payment.status || "PENDING"
    });

});

router.post('/processaCobrancasEmFila', async (req, res) => {
    try{
        await paymentMethods.paysLateBills();
    } catch (e) {
        res.status(500).send("Internal Server Error: " + e.message);
    }
    res.status(200).send("Processamento concluído com sucesso");


});

router.post('/filaCobranca', async (req, res) => {
    let {valor, ciclista} = req.body;
    const now = new Date();
    const requestedTime = now.toLocaleString('pt-BR');

    try {
        let bill = await paymentMethods.createBill(ciclista, valor, requestedTime);
        const endTime = now.toLocaleString('pt-BR', );

        return res.status(200).send( {
            message: "Cobrança solicitada",
            valor: valor,
            ciclista: ciclista,
            horaSolicitacao: bill.requestedTime,
            horaFinalizacao: endTime,
            id: bill.orderId,
            status: bill.status
        });
    } catch (e) {
        return res.status(500).send("Internal Server Error: " + e.message);
    }
});

router.get('/cobranca/:billId', async (req, res) => {
    const billId = req.params.billId;

    try {
        const bill = await paymentMethods.getsBill(billId);
        res.status(200).json(bill);
    } catch (error) {
        if (error.message === "Bill not found") {
            return res.status(404).send("Não encontrado.");
        }
        res.status(500).send("Internal Server Error: " + error.message);
    }
});



module.exports = router;

