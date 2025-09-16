// app/api/send-email/route.js - Using Gmail SMTP

import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { email } = await request.json();

    // Validate email
    if (!email || !isValidEmail(email)) {
      return NextResponse.json(
        { error: "Please provide a valid email address" },
        { status: 400 }
      );
    }

    // Dynamic import of nodemailer
    const nodemailer = await import("nodemailer");

    // Configure Gmail SMTP
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // STARTTLS
      auth: {
        user: process.env.GMAIL_USER, // consoleforeveryone0809@gmail.com
        pass: process.env.GMAIL_APP_PASSWORD, // Gmail App Password
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    // Sample email content
    const mailOptions = {
      from: `"Console For Everyone" <${process.env.GMAIL_USER}>`,
      to: email,
      replyTo: process.env.GMAIL_USER,
      subject: "Welcome! Your Console For Everyone Getting Started Guide",
      headers: {
        "Message-ID": `<${Date.now()}.${Math.random()
          .toString(36)
          .substr(2, 9)}@gmail.com>`,
        Date: new Date().toUTCString(),
        "X-Mailer": "Console For Everyone Mailer v1.0",
      },
      text: `Hi there!

This is a sample email sent from Console For Everyone. We're excited to connect with you!

What's included:
- Professional email delivery
- Secure SMTP connection  
- Beautiful HTML templates
- Fast API responses

Visit our website: https://consoleforeveryone.com

If you have any questions, feel free to reach out to us!

Best regards,
Console For Everyone Team

Sent from consoleforeveryone0809@gmail.com
© 2024 Console For Everyone. All rights reserved.`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { 
              font-family: Arial, sans-serif; 
              line-height: 1.6; 
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header { 
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 30px;
              text-align: center;
              border-radius: 10px 10px 0 0;
            }
            .content {
              background: #f9f9f9;
              padding: 30px;
              border-radius: 0 0 10px 10px;
            }
            .footer {
              text-align: center;
              margin-top: 20px;
              font-size: 12px;
              color: #666;
            }
            .button {
              display: inline-block;
              background: #667eea;
              color: white;
              padding: 12px 30px;
              text-decoration: none;
              border-radius: 5px;
              margin: 20px 0;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>🎉 Hello from Console For Everyone!</h1>
          </div>
          <div class="content">
            <p>Hi there!</p>
            <p>This is a sample email sent from Console For Everyone. We're excited to connect with you!</p>
            
            <h3>✨ What's included:</h3>
            <ul>
              <li>📧 Professional email delivery</li>
              <li>🔒 Secure SMTP connection</li>
              <li>🎨 Beautiful HTML templates</li>
              <li>⚡ Fast API responses</li>
            </ul>
            
            <a href="https://consoleforeveryone.com" class="button">Visit Our Website</a>
            
            <p>If you have any questions, feel free to reach out to us!</p>
            
            <p>Best regards,<br>
            <strong>Console For Everyone Team</strong></p>
          </div>
          <div class="footer">
            <p>Sent with ❤️ from consoleforeveryone0809@gmail.com</p>
            <p>© 2024 Console For Everyone. All rights reserved.</p>
          </div>
        </body>
        </html>
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return NextResponse.json({
      success: true,
      message: `Sample email sent successfully to ${email} from ${process.env.GMAIL_USER}`,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Email send error:", error);
    return NextResponse.json(
      {
        error: "Failed to send email",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

// Email validation helper
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
