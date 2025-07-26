const {When, Then} = require("@cucumber/cucumber");
const axios = require("axios");

When(/^a rota validarCartaoCredito é chamada com número "([^"]*)", nome "([^"]*)", data de validade "12\/25"([^"]*)"123"$/, async function () {
    try {
        this.response = await axios.post("http://localhost:3000/email/enviarEmail", {
            email: email,
            subject: subject,
            body: body
        });

    } catch (error) {
        this.error = error;
    }
});
Then(/^o cartão de crédito deve ser validado com sucesso$/, function () {
    assert.ok(this.response, "A resposta não deve ser nula");
});