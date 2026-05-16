import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// Verify connection on startup
resend.emails.send({
    from: 'onboarding@resend.dev',
    to: 'your_registered_email@gmail.com', // your resend account email
    subject: 'Server Started',
    html: '<p>Email server is ready</p>'
}).then(() => {
    console.log("✅ Email server is ready to send messages");
}).catch((error) => {
    console.error("❌ Error connecting to email server:", error);
});

export const sendEmail = async (to, subject, text, html) => {
    try {
        const data = await resend.emails.send({
            from: 'onboarding@resend.dev', // replace with your domain in production
            to,
            subject,
            text,
            html
        });

        console.log("✅ Email sent:", data.id);

    } catch (error) {
        console.log("❌ Email error FULL:", error);
    }
};