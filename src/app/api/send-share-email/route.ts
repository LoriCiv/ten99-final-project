import { NextResponse } from 'next/server';
import sgMail from '@sendgrid/mail';

// Set the API key from your environment variables
// This line should only run if the key exists
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

export async function POST(request: Request) {
  // Double-check that the key is configured before trying to send
  if (!process.env.SENDGRID_API_KEY) {
    console.error('SendGrid API Key not configured.');
    return NextResponse.json({ error: 'Email service is not configured.' }, { status: 500 });
  }

  try {
    const body = await request.json();
    const { to, from, subject, link } = body;

    // Validate that all required fields were sent from the frontend
    if (!to || !from || !subject || !link) {
      return NextResponse.json({ error: 'Missing required fields for email.' }, { status: 400 });
    }

    const msg = {
      to: to,
      from: from, // IMPORTANT: This email must be a verified sender in your SendGrid account
      subject: subject,
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px;">
          <h2 style="color: #0d244e;">A Document Has Been Shared With You</h2>
          <p>You can view the shared job file by clicking the link below:</p>
          <p style="text-align: center; margin: 20px 0;">
            <a 
              href="${link}" 
              style="background-color: #007bff; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-size: 16px;"
            >
              View Shared File
            </a>
          </p>
          <p>If the button does not work, you can copy and paste this link into your browser:</p>
          <p style="word-break: break-all; font-size: 12px; color: #555;">${link}</p>
          <hr style="border: none; border-top: 1px solid #eee; margin-top: 20px;" />
          <p style="font-size: 12px; color: #888;">Shared via the Ten99 App.</p>
        </div>
      `,
    };

    // Send the email
    await sgMail.send(msg);
    return NextResponse.json({ message: 'Email sent successfully' }, { status: 200 });

  } catch (error) {
    // Log the detailed error on the server for debugging
    console.error('Error sending email via SendGrid:', error);
    return NextResponse.json({ error: 'Internal Server Error while sending email.' }, { status: 500 });
  }
}
