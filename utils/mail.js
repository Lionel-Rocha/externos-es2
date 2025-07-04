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

function validateMail(email){
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);

}

// Enviar o e-mail
async function sendMail(email, subject, message) {

    let isValidEmail = validateMail(email);

    if (isValidEmail){
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
    } else {
        throw new Error("Invalid email address: " + email);
    }


}


module.exports = { sendMail };
