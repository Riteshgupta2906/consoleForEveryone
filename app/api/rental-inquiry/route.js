// app/api/rental-inquiry/route.js (Updated with Unified Email Service)
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { emailService } from "@/lib/emailService";

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
    if (!emailService.isValidEmail(data.email)) {
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
    // if (startDateTime <= now) {
    //   return NextResponse.json(
    //     { error: "Start date and time must be in the future" },
    //     { status: 400 }
    //   );
    // }

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

    // Prepare data for email service
    const inquiryData = {
      ...data,
      phone: phoneNumber, // Use cleaned phone number
    };

    // Send notification email to admin using unified service
    let notificationResult = null;
    try {
      notificationResult = await emailService.sendNotificationEmail(
        inquiryData
      );
      console.log("Notification email result:", notificationResult);
    } catch (emailError) {
      console.error("Failed to send notification email:", emailError.message);
      // Don't fail the entire request if email fails
    }

    // Send confirmation email to customer using unified service
    let confirmationResult = null;
    try {
      confirmationResult = await emailService.sendCustomerConfirmation(
        inquiryData
      );
      console.log("Customer confirmation email result:", confirmationResult);
    } catch (emailError) {
      console.error(
        "Failed to send customer confirmation email:",
        emailError.message
      );
      // Don't fail the entire request if email fails
    }

    // Prepare response with email status
    const response = {
      message: "Inquiry submitted successfully",
      inquiry: {
        id: savedInquiry.id,
        status: "pending",
      },
      notifications: {
        admin: notificationResult
          ? {
              sent: true,
              service: notificationResult.service,
              message: notificationResult.message,
            }
          : {
              sent: false,
              error: "Failed to send admin notification",
            },
        customer: confirmationResult
          ? {
              sent: true,
              service: confirmationResult.service,
              message: confirmationResult.message,
            }
          : {
              sent: false,
              error: "Failed to send customer confirmation",
            },
      },
    };

    return NextResponse.json(response, { status: 200 });
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
      {
        error: "Internal server error",
        details:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// Optional: Health check endpoint for email services
export async function GET() {
  try {
    // You could add a simple test to check if both email services are configured
    const hasResend = !!process.env.RESEND_API_KEY;
    const hasZoho = !!(process.env.ZOHO_EMAIL && process.env.ZOHO_APP_PASSWORD);

    return NextResponse.json({
      status: "healthy",
      emailServices: {
        resend: {
          configured: hasResend,
          primary: true,
        },
        zoho: {
          configured: hasZoho,
          fallback: true,
        },
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Health check failed", details: error.message },
      { status: 500 }
    );
  }
}
