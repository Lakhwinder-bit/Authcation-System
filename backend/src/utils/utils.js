export function generateOtp(){
    return Math.floor(100000 + Math.random() * 900000).toString();
}
export function getOtpHtml(otp, username) {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>OTP Verification</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                padding: 20px;
            }
            .container {
                max-width: 500px;
                margin: auto;
                background: #ffffff;
                padding: 20px;
                border-radius: 10px;
                text-align: center;
            }
            .otp {
                font-size: 30px;
                font-weight: bold;
                color: #2d89ef;
                margin: 20px 0;
            }
            .footer {
                font-size: 12px;
                color: #777;
                margin-top: 20px;
            }
        </style>
    </head>
    <body>
        <div class="container">
         <h2>Hello, ${username} 👋</h2>
            <h2>OTP Verification</h2>
            <p>Your One-Time Password (OTP) is:</p>
            <div class="otp">${otp}</div>
            <p>This OTP is valid for 5 minutes.</p>
            <div class="footer">
                If you did not request this, please ignore this email.
            </div>
        </div>
    </body>
    </html>
    `;
}