import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      tradieEmail,
      tradieName,
      businessName,
      customerName,
      customerPhone,
      customerEmail,
      location,
      jobDetails,
    } = body;

    const { data, error } = await resend.emails.send({
      from: "Vekio <onboarding@resend.dev>",
      to: tradieEmail,
      subject: `New Vekio enquiry from ${customerName}`,
      html: `
        <h2>New Vekio enquiry</h2>

        <p>Hi ${tradieName},</p>

        <p>You received a new enquiry for <strong>${businessName}</strong>.</p>

        <hr />

        <p><strong>Customer:</strong> ${customerName}</p>
        <p><strong>Phone:</strong> ${customerPhone}</p>
        <p><strong>Email:</strong> ${customerEmail}</p>
        <p><strong>Location:</strong> ${location}</p>

        <p><strong>Job details:</strong></p>
        <p>${jobDetails}</p>

        <hr />

        <p>This enquiry was sent through your Vekio profile.</p>
      `,
    });

    if (error) {
      console.error(error);
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}