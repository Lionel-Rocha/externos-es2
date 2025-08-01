
const {obterToken} = require("../middlewares/paymentClient");
const fetch = require("node-fetch");
const crypto = require("crypto");

async function verifyCreditCard(cardNumber,name, expiry,cvv) {
    const accessToken = await obterToken();
    let amount = 1; //1 real

    const response_createbill = await fetch('https://api-m.sandbox.paypal.com/v2/checkout/orders', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
            'PayPal-Request-Id': crypto.randomUUID()
        },
        body: JSON.stringify({
            intent: "CAPTURE",
            purchase_units: [{
                amount: {
                    currency_code: "BRL",
                    value: amount.toString()
                }
            }]
        })
    });

    const data = await response_createbill.json();
    const response_paybill = await fetch(`https://api-m.sandbox.paypal.com/v2/checkout/orders/${data.id}/capture`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
            'PayPal-Request-Id': response_createbill.orderId,
        },
        body: JSON.stringify({
            payment_source: {
                card: {
                    number: cardNumber,
                    expiry: expiry,
                    security_code: cvv,
                    name: name
                }
            }
        })


    });



    if (response_paybill.status === 201){
        return "VALID";
    }

    return "INVALID";


}

module.exports = {
    verifyCreditCard
}