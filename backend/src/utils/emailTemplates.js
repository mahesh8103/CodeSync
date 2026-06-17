
export const otpEmailTemplate = (otp, fullName) => {
    return `
        <div style="
            font-family: Arial, sans-serif;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f9f9f9;
        ">
            <div style="
                background-color: #1e1e1e;
                padding: 30px;
                border-radius: 10px;
                text-align: center;
            ">
                <!-- Header -->
                <h1 style="
                    color: #ffffff;
                    font-size: 28px;
                    margin-bottom: 5px;
                ">
                    💻 CodeCollab
                </h1>
                <p style="color: #888; margin-top: 0;">
                    Real-Time Collaborative Code Editor
                </p>

                <!-- Divider -->
                <hr style="border-color: #333; margin: 20px 0;">

                <!-- Body -->
                <h2 style="color: #ffffff;">
                    Verify Your Email
                </h2>
                <p style="color: #cccccc; font-size: 16px;">
                    Hey ${fullName}! Welcome to CodeSync 👋
                </p>
                <p style="color: #cccccc; font-size: 16px;">
                    Use the OTP below to verify your email address.
                    This OTP is valid for <strong>10 minutes</strong> only.
                </p>

                <!-- OTP Box -->
                <div style="
                    background-color: #2d2d2d;
                    border: 2px solid #4f46e5;
                    border-radius: 8px;
                    padding: 20px;
                    margin: 25px 0;
                ">
                    <p style="
                        color: #888;
                        font-size: 14px;
                        margin: 0 0 10px 0;
                    ">
                        Your OTP Code
                    </p>
                    <h1 style="
                        color: #4f46e5;
                        font-size: 48px;
                        letter-spacing: 10px;
                        margin: 0;
                    ">
                        ${otp}
                    </h1>
                </div>

                <!-- Warning -->
                <p style="color: #ff6b6b; font-size: 14px;">
                    ⚠️ Never share this OTP with anyone.
                    CodeSync will never ask for your OTP.
                </p>

                <!-- Footer -->
                <hr style="border-color: #333; margin: 20px 0;">
                <p style="color: #666; font-size: 12px;">
                    If you did not create an account,
                    please ignore this email.
                </p>
            </div>
        </div>
    `
}

// Reset Password Email Template
export const resetPasswordEmailTemplate = (resetUrl, fullName) => {
    return `
        <div style="
            font-family: Arial, sans-serif;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f9f9f9;
        ">
            <div style="
                background-color: #1e1e1e;
                padding: 30px;
                border-radius: 10px;
                text-align: center;
            ">
                <!-- Header -->
                <h1 style="
                    color: #ffffff;
                    font-size: 28px;
                    margin-bottom: 5px;
                ">
                    💻 CodeSync
                </h1>
                <p style="color: #888; margin-top: 0;">
                    Real-Time Collaborative Code Editor
                </p>

                <!-- Divider -->
                <hr style="border-color: #333; margin: 20px 0;">

                <!-- Body -->
                <h2 style="color: #ffffff;">
                    Reset Your Password
                </h2>
                <p style="color: #cccccc; font-size: 16px;">
                    Hey ${fullName}!
                </p>
                <p style="color: #cccccc; font-size: 16px;">
                    You requested to reset your password.
                    Click the button below to reset it.
                    This link is valid for <strong>1 hour</strong> only.
                </p>

                <!-- Button -->
                <a 
                    href="${resetUrl}"
                    style="
                        display: inline-block;
                        background-color: #4f46e5;
                        color: #ffffff;
                        padding: 14px 30px;
                        border-radius: 8px;
                        text-decoration: none;
                        font-size: 16px;
                        font-weight: bold;
                        margin: 20px 0;
                    "
                >
                    Reset Password
                </a>

                <!-- Warning -->
                <p style="color: #ff6b6b; font-size: 14px;">
                    ⚠️ This link expires in 1 hour.
                    If you did not request this,
                    please ignore this email.
                </p>

                <!-- Footer -->
                <hr style="border-color: #333; margin: 20px 0;">
                <p style="color: #666; font-size: 12px;">
                    If you did not request a password reset,
                    no action is required.
                </p>
            </div>
        </div>
    `
}

// Welcome Email Template (after verification)
export const welcomeEmailTemplate = (fullName) => {
    return `
        <div style="
            font-family: Arial, sans-serif;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f9f9f9;
        ">
            <div style="
                background-color: #1e1e1e;
                padding: 30px;
                border-radius: 10px;
                text-align: center;
            ">
                <h1 style="color: #ffffff;">
                    💻 CodeSync
                </h1>
                <hr style="border-color: #333; margin: 20px 0;">

                <h2 style="color: #4f46e5;">
                    Welcome Aboard! 🎉
                </h2>
                <p style="color: #cccccc; font-size: 16px;">
                    Hey ${fullName}! Your email is verified.
                    You can now start coding with your team!
                </p>

                <div style="
                    background-color: #2d2d2d;
                    border-radius: 8px;
                    padding: 20px;
                    margin: 20px 0;
                    text-align: left;
                ">
                    <p style="color: #cccccc; margin: 8px 0;">
                         Create coding rooms
                    </p>
                    <p style="color: #cccccc; margin: 8px 0;">
                         Invite team members
                    </p>
                    <p style="color: #cccccc; margin: 8px 0;">
                         Code in 10+ languages
                    </p>
                    <p style="color: #cccccc; margin: 8px 0;">
                         Run code instantly
                    </p>
                    <p style="color: #cccccc; margin: 8px 0;">
                         AI powered suggestions
                    </p>
                </div>

                <hr style="border-color: #333; margin: 20px 0;">
                <p style="color: #666; font-size: 12px;">
                    Happy Coding! 🚀
                </p>
            </div>
        </div>
    `
}