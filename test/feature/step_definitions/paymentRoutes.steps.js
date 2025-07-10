const { Given, When, Then } = require('@cucumber/cucumber');
const axios = require('axios');
const assert = require('assert');

const BASE_URL = 'http://localhost:3000'; // ajuste para sua porta se diferente

let response;
let lastBillId;

Given('o usuário {string} existe', function (userId) {
    this.userId = userId;
});

Given('uma cobrança foi criada para o usuário {string}', async function (userId) {
    const res = await axios.post(`${BASE_URL}/payment/filaCobranca`, {
        userId,
        value: 25
    });

    // supondo que o ID venha na resposta
    lastBillId = res.data?.id || '1';
});

When('o sistema buscar a última cobrança criada', async function () {
    try {
        response = await axios.get(`${BASE_URL}/payment/cobranca/${lastBillId}`);
        this.response = response;
    } catch (err) {
        response = err.response;
    }
});

When('uma cobrança de valor {string} for criada para o usuário {string}', async function (value, userId) {
    try {
        response = await axios.post(`${BASE_URL}/payment/cobranca`, {
            userId,
            value: isNaN(Number(value)) ? value : Number(value)
        });
    } catch (err) {
        response = err.response;
    }
});

When('uma cobrança de valor {string} for enfileirada para o usuário {string}', async function (value, userId) {
    try {
        response = await axios.post(`${BASE_URL}/payment/filaCobranca`, {
            userId,
            value: isNaN(Number(value)) ? value : Number(value)
        });
    } catch (err) {
        response = err.response;
    }
});

When('o sistema processar as cobranças em fila', async function () {
    try {
        response = await axios.post(`${BASE_URL}/payment/processaCobrancasEmFila`);
        this.response = response;
    } catch (err) {
        response = err.response;
    }
});

When('o sistema buscar a cobrança {string}', async function (billId) {
    try {
        response = await axios.get(`${BASE_URL}/payment/cobranca/${billId}`);
        this.response = response;
    } catch (err) {
        response = err.response;
    }
});

Then('a resposta deve conter {string}', function (expectedText) {
    const text = typeof response.data === 'string'
        ? response.data
        : JSON.stringify(response.data);
    assert(text.includes(expectedText));



});

Then('a resposta deve conter o status {int}', function (expectedStatus) {
    assert.strictEqual(response.status, expectedStatus);
});

Then('a resposta deve ter status {int}', function (expectedStatus) {
    assert.strictEqual(response.status, expectedStatus);
});

Then('a resposta deve ser {string}', function (expected) {
    assert.strictEqual(response.data, expected);
});

Then(/^a resposta deve conter o ID "([^"]*)"$/, function (expectedId) {
    assert(response.data?.id === expectedId);
});
Then('a resposta deve conter status {int}', function (status) {
    assert(response.status = status);
});