const nodemailer = require("nodemailer");

const sendEmail = async (email, otp) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSKEY
            }
        });

        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: "🔐 Your Chatly OTP Code",
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border-radius: 12px; border: 1px solid #e5e7eb; background: #ffffff;">
                    <div style="text-align: center; margin-bottom: 20px;">
                        <div style="display: inline-block; padding: 12px 20px; border-radius: 50%; background: linear-gradient(to right, #00BFA6, #0AE2C3);">
                            <span style="font-size: 24px; color: #fff; font-weight: bold;">C</span>
                        </div>
                        <h2 style="color: #00BFA6; margin: 15px 0 5px 0;">Welcome to Chatly</h2>
                        <p style="color: #6b7280; font-size: 14px; margin: 0;">Secure authentication made simple</p>
                    </div>

                    <p style="font-size: 16px; color: #374151;">Hello,</p>
                    <p style="font-size: 16px; color: #374151;">
                        Use the following One-Time Password (OTP) to verify your account:
                    </p>

                    <div style="text-align: center; margin: 30px 0;">
                        <span style="display: inline-block; background: linear-gradient(to right, #00BFA6, #0AE2C3); color: #fff; font-size: 28px; letter-spacing: 6px; padding: 14px 28px; border-radius: 10px; font-weight: bold;">
                            ${otp}
                        </span>
                    </div>

                    <p style="font-size: 14px; color: #6b7280;">
                        ⚠️ This OTP will expire in <b>10 minutes</b>. Please do not share it with anyone for your account’s safety.
                    </p>

                    <p style="font-size: 14px; color: #6b7280; margin-top: 25px;">
                        Best regards,<br/>
                        <span style="color: #00BFA6; font-weight: bold;">The Chatly Team</span>
                    </p>
                </div>
            `,
        };

        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        throw new Error("Failed to send email");
    }
}

module.exports = { sendEmail };