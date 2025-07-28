const express = require('express');
const cors = require('cors');
const paymentClient = require('./middlewares/paymentClient');
const paymentRoutes = require('./controllers/payment');
const mailRoutes = require('./controllers/mail');
const databaseRoutes = require('./controllers/database');
const app = express();
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.status(200).send("API viva e funcionando!");
});

app.use('/email', mailRoutes);

app.use('/payment', paymentRoutes);

app.use('/database', databaseRoutes);

app.use('/verifyCard', require('./controllers/verifyCard'));
app.listen(3000, () => {
    paymentClient.client();
    console.log('Servidor rodando na porta 3000');
});

module.exports = app;