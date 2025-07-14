const express = require("express");
const router = express.Router();
const mailUtils = require("../services/mail");

// Rota para enviar um email. Pode ser que não funcione.
router.post('/enviarEmail', async (req, res) => {
    const { email, assunto, mensagem } = req.body;

    if (!email || !assunto || !mensagem) {
        return res.status(400).send("Email, assunto e corpo são necessários.");
    }

    try {
        const info = await mailUtils.sendMail(email, assunto, mensagem);
        res.status(200).send(`Email enviado com sucesso: ${info}`);
    } catch (error) {
        if (error.message === "Invalid email address: " + email) {
            return res.status(422).json({
                message: "Email com formato inválido."
            });
        }
        res.status(404).json({
            message: "Email não existe."
        });
    }
});

module.exports = router;