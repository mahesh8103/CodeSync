
import nodemailer from "nodemailer"

const sendEmail = async ({ email, subject, message }) => {
    try {
        // Create transporter
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        })

        // Mail options
        const mailOptions = {
            from: `"CodeSync" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: subject,
            html: message
        }

        // Send email
        await transporter.sendMail(mailOptions)
        console.log("Email sent successfully to:", email)

    } catch (error) {
        console.log("Email send error:", error)
        throw new Error("Email could not be sent")
    }
}

export { sendEmail }