// app/api/rental-inquiry/route.js (App Router)
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  try {
    const data = await request.json();
    console.log("Received data:", data);

    // Server-side validation
    const requiredFields = [
      "name",
      "email",
      "phone",
      "selectedGames",
      "houseNumber",
      "buildingName",
      "streetName",
      "pinCode",
      "city",
      "startDate",
      "startTime",
      "endDate",
      "endTime",
    ];

    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Validate phone format (handle both +91XXXXXXXXXX and XXXXXXXXXX formats)
    const phoneNumber = data.phone.replace(/^\+91/, ""); // Remove +91 if present
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phoneNumber)) {
      return NextResponse.json(
        { error: "Invalid phone number format" },
        { status: 400 }
      );
    }

    // Validate selectedGames array
    if (!Array.isArray(data.selectedGames) || data.selectedGames.length === 0) {
      return NextResponse.json(
        { error: "Please select at least one game" },
        { status: 400 }
      );
    }

    // Validate date/time logic
    const startDateTime = new Date(`${data.startDate}T${data.startTime}:00`);
    const endDateTime = new Date(`${data.endDate}T${data.endTime}:00`);
    const now = new Date();

    // Check if end date/time is after start date/time
    if (endDateTime <= startDateTime) {
      return NextResponse.json(
        { error: "End date and time must be after start date and time" },
        { status: 400 }
      );
    }

    // Check if start date/time is in the future (allow same day if time is later)
    if (startDateTime <= now) {
      return NextResponse.json(
        { error: "Start date and time must be in the future" },
        { status: 400 }
      );
    }

    // Optional: Add minimum booking duration (e.g., at least 1 hour)
    const durationHours = (endDateTime - startDateTime) / (1000 * 60 * 60);
    if (durationHours < 1) {
      return NextResponse.json(
        { error: "Minimum rental duration is 1 hour" },
        { status: 400 }
      );
    }

    // Create address object for JSON field
    const addressObj = {
      houseNumber: data.houseNumber,
      buildingName: data.buildingName,
      streetName: data.streetName,
      pinCode: data.pinCode,
      city: data.city,
    };

    // Create full address string for emails
    const fullAddress = [
      data.houseNumber,
      data.buildingName,
      data.streetName,
      data.city,
      data.pinCode,
    ]
      .filter(Boolean)
      .join(", ");

    // Save to database using Prisma
    const savedInquiry = await prisma.rentalInquiry.create({
      data: {
        name: data.name,
        email: data.email,
        phone: phoneNumber, // Store without +91 prefix
        selectedGames: data.selectedGames,
        customGames: data.customGames || null,
        numberOfControllers: data.numberOfControllers || 1,
        address: addressObj,
        startDate: new Date(data.startDate),
        startTime: data.startTime,
        endDate: new Date(data.endDate),
        endTime: data.endTime,
        message: data.message || null,
      },
    });

    console.log("Saved inquiry:", savedInquiry);

    // Calculate rental duration for email
    const durationDays = Math.ceil(
      (endDateTime - startDateTime) / (1000 * 60 * 60 * 24)
    );

    // Send email notification using Resend
    const { data: emailData, error: emailError } = await resend.emails.send({
      from: "Console For Everyone <noreply@consoleforeveryone.com>",
      to: [process.env.NOTIFICATION_EMAIL],
      subject: `New PS5 Rental Inquiry from ${data.name}`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 650px; margin: 0 auto; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 16px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <div style="background: rgba(255,255,255,0.1); padding: 30px; text-align: center; backdrop-filter: blur(10px);">
            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.3);">
              🎮 New PS5 Rental Inquiry
            </h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">
              A new customer is ready to game!
            </p>
          </div>

          <!-- Main Content -->
          <div style="background: #ffffff; padding: 40px;">
            
            <!-- Customer Details -->
            <div style="background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); padding: 25px; border-radius: 12px; margin-bottom: 25px; border-left: 4px solid #3b82f6;">
              <h2 style="color: #1e293b; margin: 0 0 20px 0; font-size: 20px; font-weight: 600; display: flex; align-items: center;">
                <span style="background: #3b82f6; color: white; width: 30px; height: 30px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-right: 12px; font-size: 14px;">👤</span>
                Customer Details
              </h2>
              <div style="display: grid; gap: 12px;">
                <div style="display: flex; align-items: center;">
                  <span style="color: #64748b; font-weight: 500; min-width: 80px;">Name:</span>
                  <span style="color: #1e293b; font-weight: 600;">${
                    data.name
                  }</span>
                </div>
                <div style="display: flex; align-items: center;">
                  <span style="color: #64748b; font-weight: 500; min-width: 80px;">Email:</span>
                  <span style="color: #3b82f6; font-weight: 500;">${
                    data.email
                  }</span>
                </div>
                <div style="display: flex; align-items: center;">
                  <span style="color: #64748b; font-weight: 500; min-width: 80px;">Phone:</span>
                  <span style="color: #1e293b; font-weight: 600;">+91${phoneNumber}</span>
                </div>
                <div style="display: flex; align-items: flex-start;">
                  <span style="color: #64748b; font-weight: 500; min-width: 80px;">Address:</span>
                  <span style="color: #1e293b; font-weight: 500; line-height: 1.5;">${fullAddress}</span>
                </div>
              </div>
            </div>

            <!-- Game Selection -->
            <div style="background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); padding: 25px; border-radius: 12px; margin-bottom: 25px; border-left: 4px solid #0ea5e9;">
              <h2 style="color: #1e293b; margin: 0 0 20px 0; font-size: 20px; font-weight: 600; display: flex; align-items: center;">
                <span style="background: #0ea5e9; color: white; width: 30px; height: 30px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-right: 12px; font-size: 14px;">🎯</span>
                Game Selection
              </h2>
              <div style="display: grid; gap: 12px;">
                <div>
                  <span style="color: #64748b; font-weight: 500;">Selected Games:</span>
                  <div style="margin-top: 8px;">
                    ${data.selectedGames
                      .map(
                        (game) =>
                          `<span style="background: #0ea5e9; color: white; padding: 6px 12px; border-radius: 20px; font-size: 14px; font-weight: 500; margin: 2px 4px 2px 0; display: inline-block;">${game}</span>`
                      )
                      .join("")}
                  </div>
                </div>
                ${
                  data.customGames
                    ? `
                <div>
                  <span style="color: #64748b; font-weight: 500;">Custom Games:</span>
                  <div style="color: #1e293b; font-weight: 500; margin-top: 4px;">${data.customGames}</div>
                </div>`
                    : ""
                }
                <div>
                  <span style="color: #64748b; font-weight: 500;">Controllers:</span>
                  <span style="color: #1e293b; font-weight: 600; margin-left: 8px;">${
                    data.numberOfControllers || 1
                  }</span>
                </div>
              </div>
            </div>

            <!-- Rental Details -->
            <div style="background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); padding: 25px; border-radius: 12px; margin-bottom: 25px; border-left: 4px solid #22c55e;">
              <h2 style="color: #1e293b; margin: 0 0 20px 0; font-size: 20px; font-weight: 600; display: flex; align-items: center;">
                <span style="background: #22c55e; color: white; width: 30px; height: 30px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-right: 12px; font-size: 14px;">📅</span>
                Rental Schedule
              </h2>
              <div style="display: grid; gap: 12px;">
                <div style="display: flex; align-items: center;">
                  <span style="color: #64748b; font-weight: 500; min-width: 80px;">Start:</span>
                  <span style="color: #1e293b; font-weight: 600;">${new Date(
                    data.startDate
                  ).toLocaleDateString("en-IN", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })} at ${data.startTime}</span>
                </div>
                <div style="display: flex; align-items: center;">
                  <span style="color: #64748b; font-weight: 500; min-width: 80px;">End:</span>
                  <span style="color: #1e293b; font-weight: 600;">${new Date(
                    data.endDate
                  ).toLocaleDateString("en-IN", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })} at ${data.endTime}</span>
                </div>
                <div style="display: flex; align-items: center;">
                  <span style="color: #64748b; font-weight: 500; min-width: 80px;">Duration:</span>
                  <span style="background: #22c55e; color: white; padding: 4px 12px; border-radius: 12px; font-weight: 600; font-size: 14px;">${durationDays} day${
        durationDays !== 1 ? "s" : ""
      }</span>
                </div>
                ${
                  data.message
                    ? `
                <div style="margin-top: 8px;">
                  <span style="color: #64748b; font-weight: 500;">Special Requirements:</span>
                  <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; margin-top: 4px; color: #1e293b; font-style: italic;">${data.message}</div>
                </div>`
                    : ""
                }
              </div>
            </div>

            <!-- Action Required -->
            <div style="background: linear-gradient(135deg, #fef3c7 0%, #fbbf24 100%); padding: 20px; border-radius: 12px; text-align: center; border: 2px dashed #f59e0b;">
              <h3 style="color: #92400e; margin: 0 0 8px 0; font-size: 18px; font-weight: 700;">⚡ Action Required</h3>
              <p style="color: #b45309; margin: 0; font-weight: 500;">Review this inquiry and send a personalized quote to the customer</p>
            </div>

          </div>

          <!-- Footer -->
          <div style="background: #1e293b; padding: 20px; text-align: center;">
            <p style="color: #94a3b8; margin: 0; font-size: 14px;">
              Inquiry submitted on ${new Date().toLocaleString("en-IN", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </div>
      `,
    });

    if (emailError) {
      console.error("Email sending failed:", emailError);
    } else {
      console.log("Notification email sent successfully");
    }

    // Send confirmation email to customer
    const { error: customerEmailError } = await resend.emails.send({
      from: "Console For Everyone <noreply@consoleforeveryone.com>",
      to: [data.email],
      subject: "Your PS5 Rental Inquiry Received! 🎮",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #1a1a1a; color: #ffffff; border-radius: 12px; overflow: hidden;">
          
          <div style="background: #3b82f6; padding: 20px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px;">🎮 Thank You, ${
              data.name
            }!</h1>
          </div>

          <div style="padding: 30px;">
            
            <div style="background: #22c55e; padding: 15px; border-radius: 8px; text-align: center; margin-bottom: 20px;">
              <p style="margin: 0; font-weight: bold; color: #ffffff;">✅ Your inquiry has been received!</p>
            </div>

            <p style="margin-bottom: 20px;">We've received your PS5 rental request and will get back to you within <strong>24 hours</strong> with a personalized quote.</p>

            <div style="background: #2d2d2d; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h3 style="color: #60a5fa; margin: 0 0 15px 0;">Your Booking Summary</h3>
              <p style="margin: 8px 0;"><strong>Games:</strong> ${data.selectedGames.join(
                ", "
              )}</p>
              <p style="margin: 8px 0;"><strong>Controllers:</strong> ${
                data.numberOfControllers || 1
              }</p>
              <p style="margin: 8px 0;"><strong>Duration:</strong> ${durationDays} day${
        durationDays !== 1 ? "s" : ""
      }</p>
              <p style="margin: 8px 0;"><strong>Dates:</strong> ${
                data.startDate
              } to ${data.endDate}</p>
            </div>

            <div style="background: #2d2d2d; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h3 style="color: #60a5fa; margin: 0 0 15px 0;">What's Next?</h3>
              <p style="margin: 8px 0;">• Our team will review your request</p>
              <p style="margin: 8px 0;">• You'll receive a detailed quote via email</p>
              <p style="margin: 8px 0;">• We'll schedule delivery and setup</p>
            </div>

            <div style="background: #fbbf24; color: #000000; padding: 15px; border-radius: 8px; text-align: center;">
              <p style="margin: 0;"><strong>Questions?</strong> Contact us: ${
                process.env.CONTACT_PHONE || "+91 9876543210"
              }</p>
            </div>

          </div>
        </div>
      `,
    });

    if (customerEmailError) {
      console.error("Customer email sending failed:", customerEmailError);
    } else {
      console.log("Customer confirmation email sent successfully");
    }

    return NextResponse.json(
      {
        message: "Inquiry submitted successfully",
        //inquiryId: savedInquiry.id,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("API error:", error);

    // Handle Prisma-specific errors
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "A duplicate entry was found" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
