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
     from: "Vekio Enquiries <enquiries@vekio.com.au>",
      to: tradieEmail,
      subject: `New Vekio enquiry from ${customerName}`,
      html: `
      <div style="margin:0;padding:32px 16px;background:#f1f5f9;font-family:Arial,sans-serif;color:#0b1f33;">
  <div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:8px;overflow:hidden;">

    <div style="background:#061b2c;padding:20px 24px;">
      <span style="display:inline-block;background:#43c7eb;color:#061b2c;font-size:20px;font-weight:800;border-radius:7px;padding:2px 8px;margin-right:8px;">V</span>
      <span style="color:#ffffff;font-size:20px;font-weight:700;">Vekio</span>
    </div>

    <div style="padding:30px 24px;">
      <h2 style="margin:0 0 12px;font-size:24px;color:#061b2c;">
        You've got a new enquiry
      </h2>

      <p style="margin:0 0 24px;line-height:1.6;">
        Hi ${tradieName},<br><br>
        Someone found your Vekio profile and wants to get in touch about
        <strong>${businessName}</strong>.
      </p>

      <div style="background:#f5f7f9;border:1px solid #e2e8f0;border-radius:8px;padding:20px;margin-bottom:24px;">
        <p style="margin:0 0 12px;"><strong>Customer</strong><br>${customerName}</p>
        <p style="margin:0 0 12px;"><strong>Phone</strong><br>${customerPhone}</p>
        <p style="margin:0 0 12px;"><strong>Email</strong><br>${customerEmail}</p>
        <p style="margin:0;"><strong>Location</strong><br>${location}</p>
      </div>

      <div style="margin-bottom:24px;">
        <p style="margin:0 0 8px;font-weight:700;">Job details</p>
        <div style="background:#f5f7f9;border-left:4px solid #43c7eb;padding:16px;line-height:1.6;">
          ${jobDetails}
        </div>
      </div>

   
      <p style="margin:28px 0 0;font-size:12px;color:#64748b;line-height:1.5;">
        This enquiry was sent through your Vekio profile.
      </p>
    </div>

  </div>
</div>
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
