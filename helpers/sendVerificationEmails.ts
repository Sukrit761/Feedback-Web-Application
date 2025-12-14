import { transporter } from "@/lib/mailer";
import { ApiResponse } from "@/types/apiResponse";

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse<null>> {
  try {
    await transporter.sendMail({
      from: `"EchoMind" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "Verify your EchoMind Account 🚀",
      html: `
        <h2>Hello ${username}</h2>
        <p>Your verification code is:</p>
        <h1>${verifyCode}</h1>
        <p>This code expires in 10 minutes.</p>
      `,
    });

    console.log("📩 Email sent to:", email);
    return { success: true, message: "Verification email sent!" };

  } catch (error) {
    console.error("❌ Gmail SMTP Error:", error);
    return { success: false, message: "Email failed to send" };
  }
}
