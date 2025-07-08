const { When, Then, Given, setDefaultTimeout} = require('@cucumber/cucumber');
const {assert} = require('chai');
const paymentUtils = require('../../../services/paymentMethods');
const paymentClient = require('../../../middlewares/paymentClient');
const verifyCard = require('../../../utils/verifyCreditCard');


When(/^a rota cobranca é chamada com o valor (\d+)\.(\d+) e o id de ciclista (\d+)$/, function () {

});
Then(/^uma cobranca deve ser criada para o ciclista (\d+)$/, function () {

});