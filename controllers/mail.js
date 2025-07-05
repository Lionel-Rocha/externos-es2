const express = require("express");
const router = express.Router();
const mailUtils = require("../services/mail");

// Rota para enviar um email. Pode ser que não funcione.
router.post('/enviarEmail', async (req, res) => {
    const { email, subject, body } = req.body;

    if (!email || !subject || !body) {
        return res.status(400).send("Email, subject and body are required.");
    }

    try {

        const info = await mailUtils.sendMail(email, subject, body);
        res.status(200).send(`Email sent successfully: ${info}`);
    } catch (error) {
        //faltou o check de erro 422
        res.status(500).json({
            message: error.message
        });
    }
});

module.exports = router;