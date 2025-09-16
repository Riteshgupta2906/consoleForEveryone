// lib/emailService.js - Lightweight Unified Email Service
import { Resend } from "resend";

class UnifiedEmailService {
  constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY);
  }

  // Email validation helper
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Send email with primary service (Resend) and fallback to Zoho
  async sendEmail(emailOptions) {
    const { to, subject, html, from } = emailOptions;

    // Validate required fields
    if (!to || !subject || !html) {
      throw new Error("Missing required email fields: to, subject, html");
    }

    if (!this.isValidEmail(Array.isArray(to) ? to[0] : to)) {
      throw new Error("Invalid email address");
    }

    // Try Resend first
    try {
      console.log("Attempting to send email via Resend...");

      const { data, error } = await this.resend.emails.send({
        from: from || "Console For Everyone <hello@consoleforeveryone.com>",
        to: Array.isArray(to) ? to : [to],
        subject,
        html,
      });

      if (error) {
        console.error("Resend error:", error);
        throw new Error(`Resend failed: ${error.message}`);
      }

      console.log("Email sent successfully via Resend");
      return {
        success: true,
        service: "resend",
        data,
        message: "Email sent via Resend",
      };
    } catch (resendError) {
      console.warn("Resend failed, falling back to Zoho:", resendError.message);

      // Fallback to Zoho
      try {
        const result = await this.sendViaZoho(emailOptions);
        return result;
      } catch (zohoError) {
        console.error("Both email services failed:", {
          resend: resendError.message,
          zoho: zohoError.message,
        });
        throw new Error(
          `All email services failed. Resend: ${resendError.message}, Zoho: ${zohoError.message}`
        );
      }
    }
  }

  // Zoho SMTP fallback method
  async sendViaZoho(emailOptions) {
    const { to, subject, html, from } = emailOptions;

    try {
      console.log("Sending email via Zoho SMTP...");

      // Dynamic import of nodemailer
      const nodemailer = await import("nodemailer");

      // Configure Zoho SMTP
      const transporter = nodemailer.createTransport({
        host: "smtppro.zoho.in",
        port: 465,
        secure: true, // SSL
        auth: {
          user: process.env.ZOHO_EMAIL,
          pass: process.env.ZOHO_APP_PASSWORD,
        },
        // Additional options for reliability
        pool: true,
        maxConnections: 5,
        maxMessages: 10,
      });

      // Verify transporter configuration
      await transporter.verify();

      const mailOptions = {
        from: from || process.env.ZOHO_EMAIL,
        to: Array.isArray(to) ? to.join(", ") : to,
        subject,
        html,
      };

      const info = await transporter.sendMail(mailOptions);

      // Close the transporter
      transporter.close();

      console.log("Email sent successfully via Zoho");
      return {
        success: true,
        service: "zoho",
        data: info,
        message: "Email sent via Zoho SMTP",
      };
    } catch (error) {
      console.error("Zoho SMTP error:", error);
      throw new Error(`Zoho SMTP failed: ${error.message}`);
    }
  }

  // Method to send notification email (for admin) - Light Blue Theme
  async sendNotificationEmail(inquiryData) {
    const {
      name,
      email,
      phone,
      selectedGames,
      customGames,
      numberOfControllers,
      houseNumber,
      buildingName,
      streetName,
      pinCode,
      city,
      startDate,
      endDate,
      startTime,
      endTime,
      message,
    } = inquiryData;

    // Create address string
    const fullAddress = [houseNumber, buildingName, streetName, city, pinCode]
      .filter(Boolean)
      .join(", ");

    // Calculate duration
    const startDateTime = new Date(`${startDate}T${startTime}:00`);
    const endDateTime = new Date(`${endDate}T${endTime}:00`);
    const durationDays = Math.ceil(
      (endDateTime - startDateTime) / (1000 * 60 * 60 * 24)
    );

    const notificationHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New PS5 Rental Inquiry</title>
      </head>
      <body style="margin:0;padding:20px;background-color:#f0f9ff;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif">
        <div style="max-width:650px;margin:0 auto;background:white;border-radius:16px;overflow:hidden;box-shadow:0 10px 25px rgba(59,130,246,0.15);border:1px solid #e0f2fe">
          
          <!-- Header -->
          <div style="background:linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);color:white;padding:32px 24px;text-align:center">
            <div style="font-size:48px;margin-bottom:8px">🎮</div>
            <h1 style="margin:0;font-size:28px;font-weight:600;letter-spacing:-0.5px">New PS5 Rental Inquiry</h1>
            <p style="margin:8px 0 0 0;opacity:0.9;font-size:16px">Action required - Review and respond</p>
          </div>

          <!-- Content -->
          <div style="padding:32px 24px">
            
            <!-- Customer Details Card -->
            <div style="background:#f0f9ff;border:2px solid #e0f2fe;border-radius:12px;padding:24px;margin-bottom:24px">
              <div style="display:flex;align-items:center;margin-bottom:16px">
                <div style="font-size:24px;margin-right:12px">👤</div>
                <h3 style="margin:0;color:#1e40af;font-size:20px;font-weight:600">Customer Details</h3>
              </div>
              <div style="display:grid;gap:12px">
                <div style="display:flex;align-items:center">
                  <span style="font-weight:600;color:#374151;min-width:80px">Name:</span>
                  <span style="color:#1f2937;font-size:16px">${name}</span>
                </div>
                <div style="display:flex;align-items:center">
                  <span style="font-weight:600;color:#374151;min-width:80px">Email:</span>
                  <span style="color:#1f2937;font-size:16px">${email}</span>
                </div>
                <div style="display:flex;align-items:center">
                  <span style="font-weight:600;color:#374151;min-width:80px">Phone:</span>
                  <span style="color:#1f2937;font-size:16px">+91 ${phone}</span>
                </div>
                <div style="display:flex;align-items:flex-start">
                  <span style="font-weight:600;color:#374151;min-width:80px;margin-top:2px">Address:</span>
                  <span style="color:#1f2937;font-size:16px;line-height:1.5">${fullAddress}</span>
                </div>
              </div>
            </div>

            <!-- Games & Details Card -->
            <div style="background:white;border:2px solid #dbeafe;border-radius:12px;padding:24px;margin-bottom:24px">
              <div style="display:flex;align-items:center;margin-bottom:16px">
                <div style="font-size:24px;margin-right:12px">🎯</div>
                <h3 style="margin:0;color:#1e40af;font-size:20px;font-weight:600">Games & Equipment</h3>
              </div>
              <div style="display:grid;gap:12px">
                <div style="display:flex;align-items:flex-start">
                  <span style="font-weight:600;color:#374151;min-width:100px;margin-top:2px">Games:</span>
                  <span style="color:#1f2937;font-size:16px;line-height:1.5">${selectedGames.join(
                    ", "
                  )}</span>
                </div>
                ${
                  customGames
                    ? `
                <div style="display:flex;align-items:flex-start">
                  <span style="font-weight:600;color:#374151;min-width:100px;margin-top:2px">Custom:</span>
                  <span style="color:#1f2937;font-size:16px;line-height:1.5">${customGames}</span>
                </div>
                `
                    : ""
                }
                <div style="display:flex;align-items:center">
                  <span style="font-weight:600;color:#374151;min-width:100px">Controllers:</span>
                  <span style="color:#1f2937;font-size:16px">${
                    numberOfControllers || 1
                  }</span>
                </div>
              </div>
            </div>

            <!-- Schedule Card -->
            <div style="background:#f0f9ff;border:2px solid #e0f2fe;border-radius:12px;padding:24px;margin-bottom:24px">
              <div style="display:flex;align-items:center;margin-bottom:16px">
                <div style="font-size:24px;margin-right:12px">📅</div>
                <h3 style="margin:0;color:#1e40af;font-size:20px;font-weight:600">Rental Schedule</h3>
              </div>
              <div style="display:grid;gap:12px">
                <div style="display:flex;align-items:center">
                  <span style="font-weight:600;color:#374151;min-width:80px">Start:</span>
                  <span style="color:#1f2937;font-size:16px">${new Date(
                    startDate
                  ).toLocaleDateString("en-IN")} at ${startTime}</span>
                </div>
                <div style="display:flex;align-items:center">
                  <span style="font-weight:600;color:#374151;min-width:80px">End:</span>
                  <span style="color:#1f2937;font-size:16px">${new Date(
                    endDate
                  ).toLocaleDateString("en-IN")} at ${endTime}</span>
                </div>
                <div style="display:flex;align-items:center">
                  <span style="font-weight:600;color:#374151;min-width:80px">Duration:</span>
                  <span style="color:#1f2937;font-size:16px;font-weight:600">${durationDays} day${
      durationDays !== 1 ? "s" : ""
    }</span>
                </div>
              </div>
              ${
                message
                  ? `
              <div style="margin-top:16px;padding-top:16px;border-top:1px solid #e0f2fe">
                <span style="font-weight:600;color:#374151;display:block;margin-bottom:8px">Customer Message:</span>
                <div style="background:white;padding:16px;border-radius:8px;border:1px solid #e0f2fe;font-style:italic;color:#1f2937;line-height:1.6">${message}</div>
              </div>
              `
                  : ""
              }
            </div>

            <!-- Action Required Banner -->
            <div style="background:linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);color:white;padding:20px;border-radius:12px;text-align:center;margin-bottom:24px">
              <div style="font-size:24px;margin-bottom:8px">⚡</div>
              <div style="font-size:18px;font-weight:600;margin-bottom:4px">Action Required</div>
              <div style="font-size:14px;opacity:0.9">Review details and send personalized quote to customer</div>
            </div>

          </div>

          <!-- Footer -->
          <div style="background:#f8fafc;padding:20px 24px;text-align:center;border-top:1px solid #e0f2fe">
            <p style="margin:0;color:#64748b;font-size:14px">
              📧 Inquiry submitted on ${new Date().toLocaleString(
                "en-IN"
              )} | Console For Everyone
            </p>
          </div>

        </div>
      </body>
      </html>`;

    return await this.sendEmail({
      to: process.env.NOTIFICATION_EMAIL,
      subject: `🎮 New PS5 Rental Inquiry from ${name}`,
      html: notificationHtml,
    });
  }

  // Method to send customer confirmation email - Light Blue Theme
  async sendCustomerConfirmation(inquiryData) {
    const {
      name,
      email,
      selectedGames,
      numberOfControllers,
      startDate,
      endDate,
    } = inquiryData;

    // Calculate duration
    const startDateTime = new Date(`${startDate}T00:00:00`);
    const endDateTime = new Date(`${endDate}T23:59:59`);
    const durationDays = Math.ceil(
      (endDateTime - startDateTime) / (1000 * 60 * 60 * 24)
    );

    const confirmationHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>PS5 Rental Inquiry Confirmed</title>
      </head>
      <body style="margin:0;padding:20px;background-color:#f0f9ff;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif">
        <div style="max-width:600px;margin:0 auto;background:white;border-radius:16px;overflow:hidden;box-shadow:0 10px 25px rgba(59,130,246,0.15);border:1px solid #e0f2fe">
          
          <!-- Header -->
          <div style="background:linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);color:white;padding:40px 24px;text-align:center">
            <div style="font-size:64px;margin-bottom:16px">🎮</div>
            <h1 style="margin:0;font-size:32px;font-weight:700;letter-spacing:-0.5px">Thank You, ${name}!</h1>
            <p style="margin:12px 0 0 0;font-size:18px;opacity:0.95">Your gaming adventure awaits</p>
          </div>

          <!-- Success Message -->
          <div style="padding:32px 24px 0 24px">
            <div style="background:linear-gradient(135deg, #10b981 0%, #059669 100%);color:white;padding:20px;border-radius:12px;text-align:center;margin-bottom:32px">
              <div style="font-size:32px;margin-bottom:8px">✅</div>
              <div style="font-size:20px;font-weight:600;margin-bottom:4px">Inquiry Received Successfully!</div>
            </div>

            <!-- Booking Summary -->
            <div style="background:#f0f9ff;border:2px solid #e0f2fe;border-radius:12px;padding:24px;margin-bottom:24px">
              <h3 style="margin:0 0 20px 0;color:#1e40af;font-size:22px;font-weight:600;text-align:center">📋 Your Booking Summary</h3>
              
              <div style="display:grid;gap:16px">
                <div style="display:flex;justify-content:space-between;align-items:center;padding:12px 0;border-bottom:1px solid #e0f2fe">
                  <span style="font-weight:600;color:#374151">🎯 Games Selected</span>
                  <span style="color:#1f2937;font-weight:500;text-align:right;max-width:60%">${selectedGames.join(
                    ", "
                  )}</span>
                </div>
                
                <div style="display:flex;justify-content:space-between;align-items:center;padding:12px 0;border-bottom:1px solid #e0f2fe">
                  <span style="font-weight:600;color:#374151">🎮 Controllers</span>
                  <span style="color:#1f2937;font-weight:500">${
                    numberOfControllers || 1
                  }</span>
                </div>
                
                <div style="display:flex;justify-content:space-between;align-items:center;padding:12px 0;border-bottom:1px solid #e0f2fe">
                  <span style="font-weight:600;color:#374151">⏱️ Duration</span>
                  <span style="color:#1f2937;font-weight:600;font-size:16px">${durationDays} day${
      durationDays !== 1 ? "s" : ""
    }</span>
                </div>
                
                <div style="display:flex;justify-content:space-between;align-items:center;padding:12px 0">
                  <span style="font-weight:600;color:#374151">📅 Rental Period</span>
                  <span style="color:#1f2937;font-weight:500;text-align:right">${startDate} to ${endDate}</span>
                </div>
              </div>
            </div>

            <!-- What's Next -->
            <div style="background:white;border:2px solid #dbeafe;border-radius:12px;padding:24px;margin-bottom:24px">
              <h3 style="margin:0 0 20px 0;color:#1e40af;font-size:20px;font-weight:600;text-align:center">🚀 What Happens Next?</h3>
              
              <div style="display:grid;gap:16px">
                <div style="display:flex;align-items:center;padding:8px 0">
                  <div style="background:#3b82f6;color:white;border-radius:50%;width:32px;height:32px;display:flex;align-items:center;justify-content:center;font-weight:600;margin-right:16px;flex-shrink:0">1</div>
                  <span style="color:#1f2937;font-size:16px;line-height:1.5">Our team reviews your request and checks availability</span>
                </div>
                
                
                
                <div style="display:flex;align-items:center;padding:8px 0">
                  <div style="background:#3b82f6;color:white;border-radius:50%;width:32px;height:32px;display:flex;align-items:center;justify-content:center;font-weight:600;margin-right:16px;flex-shrink:0">3</div>
                  <span style="color:#1f2937;font-size:16px;line-height:1.5">We schedule delivery and professional setup at your location</span>
                </div>
              </div>
            </div>

            <!-- Contact Info -->
            <div style="background:linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);color:white;padding:20px;border-radius:12px;text-align:center;margin-bottom:32px">
              <div style="font-size:24px;margin-bottom:8px">📞</div>
              <div style="font-size:16px;margin-bottom:4px;opacity:0.9">Have questions? We're here to help!</div>
              <div style="font-size:20px;font-weight:600">Contact: ${
                process.env.CONTACT_PHONE || "+91 9876543210"
              }</div>
            </div>

          </div>

          <!-- Footer -->
          <div style="background:#f8fafc;padding:24px;text-align:center;border-top:1px solid #e0f2fe">
            <p style="margin:0 0 8px 0;color:#64748b;font-size:14px">
              🎮 Thank you for choosing <strong style="color:#1e40af">Console For Everyone</strong>
            </p>
            <p style="margin:0;color:#94a3b8;font-size:12px">
              This email was sent on ${new Date().toLocaleString("en-IN")}
            </p>
          </div>

        </div>
      </body>
      </html>`;

    return await this.sendEmail({
      to: email,
      subject: "🎮 Your PS5 Rental Inquiry Confirmed - We'll Be In Touch Soon!",
      html: confirmationHtml,
    });
  }
}

// Export singleton instance
export const emailService = new UnifiedEmailService();
