const { When, Then} = require('@cucumber/cucumber');
const axios = require('axios');
const {assert} = require('chai');

When("a rota enviarEmail é chamada com destinatário {string}, assunto {string} e corpo {string}", async function (email, subject, body) {
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

Then('o email deve ser enviado com sucesso', function () {

    if (this.error) {
        throw new Error(`Erro ao enviar email: ${this.error}`);
    }
    if (!this.response || this.response.status !== 200) {
        throw new Error(`Email não enviado. Status: ${this.response ? this.response.status : 'sem resposta'}`);
    }
});
Then('deve retornar um erro informando que o endereço de email é inválido', function () {
    const errorMessage = this.error.response.data.message;
    assert.include(errorMessage, 'Invalid email address')
});