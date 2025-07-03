const nodemailer = require('nodemailer');

// SMTP
const transporter = nodemailer.createTransport({
    host: 'smtp.zoho.com',
    port: 465, 
    secure: true, 
    auth: {
        user: 'bicicletarioamigo@zohomail.com', 
        pass: process.env.PASSWORD 
    }
});

// Enviar o e-mail
async function sendMail(email, subject, message) {
    const mailOptions = {
        from: 'Bicicletário amigo <bicicletarioamigo@zohomail.com>',
        to: email,
        subject: subject,
        text: message,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent:", info.messageId);
        return info.messageId;
    } catch (error) {
        console.error("Error sending email: ", error);
        throw new Error("Failed to send email: " + error.message);
    }
}

// Exemplo de uso


module.exports = { sendMail };
