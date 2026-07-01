"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  BadgeCheck,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  FileCheck2,
  Mail,
  MapPin,
  ShieldCheck,
  Star,
  Upload,
} from "lucide-react";
import { supabase } from "../../../lib/supabase";

type Tradie = {
  id: string;
  full_name: string | null;
  business_name: string | null;
  trade: string | null;
  phone: string | null;
  email: string | null;
  slug: string | null;
};

export default function TradieProfilePage() {
  const params = useParams();
  const slug = params.id as string;

  const [tradie, setTradie] = useState<Tradie | null>(null);
  const [loading, setLoading] = useState(true);
  const [debugError, setDebugError] = useState<any>(null);

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [location, setLocation] = useState("");
  const [jobDetails, setJobDetails] = useState("");
  const [enquiryStatus, setEnquiryStatus] = useState("");

  useEffect(() => {
    async function loadTradie() {
      setLoading(true);

      const { data, error } = await supabase
        .from("tradies")
        .select("*")
        .eq("slug", slug)
        .single();

      if (error) {
        console.error(error);
        setDebugError(error);
        setTradie(null);
      } else {
        setTradie(data);
      }

      setLoading(false);
    }

    if (slug) {
      loadTradie();
    }
  }, [slug]);

async function sendEnquiry() {
  if (!tradie) return;

  setEnquiryStatus("Sending...");

  const { error } = await supabase.from("enquiries").insert({
    tradie_id: tradie.id,
    tradie_slug: tradie.slug,
    customer_name: customerName,
    phone: customerPhone,
    email: customerEmail,
    location,
    job_details: jobDetails,
    status: "new",
  });

  if (error) {
    console.error(error);
    setEnquiryStatus("Something went wrong. Check console.");
    return;
  }

  const emailResponse = await fetch("/api/send-enquiry", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      tradieEmail: tradie.email,
      tradieName: tradie.full_name,
      businessName: tradie.business_name,
      customerName,
      customerPhone,
      customerEmail,
      location,
      jobDetails,
    }),
  });

  if (!emailResponse.ok) {
    setEnquiryStatus("Enquiry saved, but email failed.");
    return;
  }

  setCustomerName("");
  setCustomerPhone("");
  setCustomerEmail("");
  setLocation("");
  setJobDetails("");
  setEnquiryStatus("Enquiry sent successfully.");
}

  if (loading) {
    return (
      <main style={{ padding: 40, color: "white", background: "#07111f" }}>
        <h1>Loading Vekio profile...</h1>
      </main>
    );
  }

  if (!tradie) {
    return (
      <main style={{ padding: 40, color: "white", background: "#07111f" }}>
        <h1>Debug: Tradie not found</h1>
        <p>
          <strong>Slug searched:</strong> {slug}
        </p>
        <pre>{JSON.stringify(debugError, null, 2)}</pre>
      </main>
    );
  }

  const businessName = tradie.business_name || "Vekio Professional";
  const fullName = tradie.full_name || "Professional";
  const firstName = fullName.split(" ")[0] || "Professional";
  const trade = tradie.trade || "Professional";
  const initials = businessName
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <main className="page-shell">
      <nav className="nav">
        <Link className="logo" href="/">
          <span className="logo-mark">V</span>
          <span>Vekio</span>
        </Link>

        <div className="nav-links">
          <Link href="/">Home</Link>
          <Link href="/login">Login</Link>
        </div>
      </nav>

      <section className="tradie-v3">
        <section className="tradie-v3-hero card">
          <div className="hero-glow" />

          <div className="tradie-v3-avatar">{initials}</div>

          <div className="tradie-v3-hero-copy">
            <div className="verified-pill">
              <BadgeCheck size={16} />
              Verified Vekio ID
            </div>

            <h1>{businessName}</h1>
            <p>
              {trade} serving Perth metro. Contact {fullName} directly through
              this verified Vekio profile.
            </p>

            <div className="v3-badges">
              <span>
                <Star size={16} /> 4.9 rating
              </span>
              <span>
                <MapPin size={16} /> Perth, WA
              </span>
              <span>
                <CalendarDays size={16} /> Replies within 24h
              </span>
              <span>
                <ClipboardCheck size={16} /> 42 completed jobs
              </span>
            </div>
          </div>

          <div className="v3-share-card">
            <strong>vekio.com/{tradie.slug}</strong>
            <span>One link. Complete professional proof.</span>
          </div>
        </section>

        <section className="tradie-v3-grid">
          <aside className="v3-enquiry card">
            <div className="eyebrow">Request a quote</div>
            <h2>Tell {firstName} what you need.</h2>
            <p>
              Fill the form once. {firstName} gets notified and can reply
              directly.
            </p>

            <form className="enquiry-form">
              <div className="field">
                <label>Your name</label>
                <input
                  type="text"
                  placeholder="Your name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                />
              </div>

              <div className="field">
                <label>Phone</label>
                <input
                  type="tel"
                  placeholder="0412 345 678"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                />
              </div>

              <div className="field">
                <label>Email</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                />
              </div>

              <div className="field">
                <label>Suburb / location</label>
                <input
                  type="text"
                  placeholder="Brabham, WA"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>

              <div className="field">
                <label>Job details</label>
                <textarea
                  placeholder="Describe the job..."
                  value={jobDetails}
                  onChange={(e) => setJobDetails(e.target.value)}
                />
              </div>

              <button className="upload-box" type="button">
                <Upload size={18} />
                Upload site photos
              </button>

              <button
                className="btn btn-primary btn-wide"
                type="button"
                onClick={sendEnquiry}
              >
                <Mail size={18} />
                Send enquiry
              </button>

              {enquiryStatus && (
                <p style={{ textAlign: "center", color: "var(--brand-2)" }}>
                  {enquiryStatus}
                </p>
              )}
            </form>
          </aside>

          <section className="v3-content">
            <div className="v3-proof-strip">
              <div className="card proof-stat">
                <strong>12</strong>
                <span>Verified documents</span>
              </div>
              <div className="card proof-stat">
                <strong>8+</strong>
                <span>Years experience</span>
              </div>
              <div className="card proof-stat">
                <strong>42</strong>
                <span>Completed jobs</span>
              </div>
            </div>

            <div className="card v3-about">
              <h2>About {firstName}</h2>
              <p>
                {businessName} provides tidy, reliable and verified {trade}
                services across Perth. Clear communication, transparent scope
                and practical advice from enquiry to completion.
              </p>
            </div>

            <div className="card">
              <h2>Recent projects</h2>
              <p>Site work, completed jobs and proof of capability.</p>

              <div className="v3-gallery">
                <div className="v3-photo photo-a">
                  <span>Switchboard upgrade</span>
                </div>
                <div className="v3-photo photo-b">
                  <span>Warehouse lighting</span>
                </div>
                <div className="v3-photo photo-c">
                  <span>Kitchen renovation</span>
                </div>
                <div className="v3-photo photo-d">
                  <span>EV charger install</span>
                </div>
              </div>
            </div>

            <div className="v3-two">
              <div className="card">
                <h2>Services</h2>
                <div className="v3-list">
                  <span>
                    <CheckCircle2 size={18} /> Switchboard upgrades
                  </span>
                  <span>
                    <CheckCircle2 size={18} /> Lighting installation
                  </span>
                  <span>
                    <CheckCircle2 size={18} /> Power points
                  </span>
                  <span>
                    <CheckCircle2 size={18} /> Fault finding
                  </span>
                  <span>
                    <CheckCircle2 size={18} /> Renovation works
                  </span>
                </div>
              </div>

              <div className="card">
                <h2>Verified documents</h2>

                <div className="credential">
                  <FileCheck2 size={18} />
                  <div>
                    <strong>Trade Licence</strong>
                    <span>Verified by Vekio</span>
                  </div>
                </div>

                <div className="credential">
                  <ShieldCheck size={18} />
                  <div>
                    <strong>Public Liability Insurance</strong>
                    <span>Verified by Vekio</span>
                  </div>
                </div>

                <div className="credential">
                  <BriefcaseBusiness size={18} />
                  <div>
                    <strong>ABN</strong>
                    <span>Verified by Vekio</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <h2>Reviews</h2>

              <div className="v3-reviews">
                <div className="v3-review">
                  <div className="review-avatar">S</div>
                  <div>
                    <strong>★★★★★</strong>
                    <p>
                      Professional, punctual and explained the work clearly
                      before starting.
                    </p>
                    <span>Sarah · Brabham</span>
                  </div>
                </div>

                <div className="v3-review">
                  <div className="review-avatar">M</div>
                  <div>
                    <strong>★★★★★</strong>
                    <p>
                      Great communication and a very clean finish. Would happily
                      use again.
                    </p>
                    <span>Michael · Midland</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </section>
      </section>
    </main>
  );
}