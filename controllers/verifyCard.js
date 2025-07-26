const express = require("express");
const {verifyCreditCard} = require("../utils/verifyCreditCard");
const router = express.Router();

router.post("/validaCartaoDeCredito", async (req, res) => {
    const { nomeTitular, numero, validade, cvv } = req.body;

    if (!nomeTitular || !numero || !cvv || !validade) {
        return res.status(400).send("Dados incompletos para verificação do cartão.");
    }

    try {
        const verificationResult = await verifyCreditCard(numero,nomeTitular, validade,cvv);
        res.status(200).send({ status: verificationResult });
    } catch (error) {
        console.error(`[verifyCard] Error verifying card: ${error.message}`);
        res.status(500).send("Erro ao verificar o cartão.");
    }
});

module.exports = router;