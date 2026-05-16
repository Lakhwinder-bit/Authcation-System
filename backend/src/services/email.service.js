import nodemailer from 'nodemailer';
import config from '../config/config.js';

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.GOOGLE_USER,
        pass: process.env.GOOGLE_PASS
    }
});

transporter.verify((error, success) => {
    if(error){
        console.error("Error connecting to email server:",error);

    }
    else{
        console.log("Email server is ready to send message")
    }
})

export const sendEmail = async (to, subject, text, html) => {
    try {
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false, // true for 465
            auth: {
                user: process.env.GOOGLE_USER,
                pass: process.env.GOOGLE_PASS
            }
        });

        const info = await transporter.sendMail({
            from: `"Auth App" <${process.env.GOOGLE_USER}>`,
            to,
            subject,
            text,
            html
        });

        console.log("✅ Email sent:", info.response);

    } catch (error) {
        console.log("❌ Email error FULL:", error);
    }
};
