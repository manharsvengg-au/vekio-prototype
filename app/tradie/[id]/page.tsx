"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  BadgeCheck,
  BriefcaseBusiness,
  Mail,
  MapPin,
  Phone,
  Send,
  UserRound,
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
  profile_photo_url: string | null;
};

export default function TradieProfilePage() {
  const params = useParams();
  const slug = params.id as string;

  const [tradie, setTradie] = useState<Tradie | null>(null);
  const [loading, setLoading] = useState(true);
  const [debugError, setDebugError] = useState<unknown>(null);

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [location, setLocation] = useState("");
  const [jobDetails, setJobDetails] = useState("");

  const [enquiryStatus, setEnquiryStatus] = useState("");
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    async function loadTradie() {
      setLoading(true);

      const { data, error } = await supabase
        .from("tradies")
        .select(
          "id, full_name, business_name, trade, phone, email, slug, profile_photo_url"
        )
        .eq("slug", slug)
        .single();

      if (error) {
        console.error("Tradie loading error:", error);
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
    if (!tradie || isSending) {
      return;
    }

    if (!customerName.trim()) {
      setEnquiryStatus("Please enter your name.");
      return;
    }

    if (!customerPhone.trim() && !customerEmail.trim()) {
      setEnquiryStatus("Please enter a phone number or email address.");
      return;
    }

    if (!jobDetails.trim()) {
      setEnquiryStatus("Please describe the job.");
      return;
    }

    setIsSending(true);
    setEnquiryStatus("Sending enquiry...");

    try {
      const { error: enquiryError } = await supabase
        .from("enquiries")
        .insert({
          tradie_id: tradie.id,
          tradie_slug: tradie.slug,
          customer_name: customerName.trim(),
          phone: customerPhone.trim(),
          email: customerEmail.trim(),
          location: location.trim(),
          job_details: jobDetails.trim(),
          status: "new",
        });

      if (enquiryError) {
        throw enquiryError;
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
          customerName: customerName.trim(),
          customerPhone: customerPhone.trim(),
          customerEmail: customerEmail.trim(),
          location: location.trim(),
          jobDetails: jobDetails.trim(),
        }),
      });

      if (!emailResponse.ok) {
        setEnquiryStatus(
          "Enquiry saved successfully, but the email notification failed."
        );
        setIsSending(false);
        return;
      }

      setCustomerName("");
      setCustomerPhone("");
      setCustomerEmail("");
      setLocation("");
      setJobDetails("");

      setEnquiryStatus("Enquiry sent successfully.");
    } catch (error) {
      console.error("Enquiry error:", error);
      setEnquiryStatus("Something went wrong. Please try again.");
    } finally {
      setIsSending(false);
    }
  }

  if (loading) {
    return (
      <main
        style={{
          minHeight: "100vh",
          padding: 40,
          color: "white",
          background: "#07111f",
        }}
      >
        <h1>Loading Vekio profile...</h1>
      </main>
    );
  }

  if (!tradie) {
    return (
      <main
        style={{
          minHeight: "100vh",
          padding: 40,
          color: "white",
          background: "#07111f",
        }}
      >
        <h1>Vekio profile not found</h1>

        <p>
          We could not find a professional with the profile address:
          <br />
          <strong>{slug}</strong>
        </p>

        <pre style={{ whiteSpace: "pre-wrap" }}>
          {JSON.stringify(debugError, null, 2)}
        </pre>
      </main>
    );
  }

  const businessName = tradie.business_name || "Vekio Professional";
  const fullName = tradie.full_name || "Professional";
  const firstName = fullName.split(" ")[0] || "Professional";
  const trade = tradie.trade || "Professional";

  const initials = businessName
    .split(" ")
    .filter(Boolean)
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

          <div
            className="tradie-v3-avatar"
            style={{
              padding: 0,
              overflow: "hidden",
              flexShrink: 0,
            }}
          >
            {tradie.profile_photo_url ? (
              <img
                src={tradie.profile_photo_url}
                alt={`${fullName} profile`}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                }}
              />
            ) : (
              initials
            )}
          </div>

          <div className="tradie-v3-hero-copy">
            <div className="verified-pill">
              <BadgeCheck size={16} />
              Vekio ID
            </div>

            <h1>{businessName}</h1>

            <p>
              Contact {fullName} directly through this Vekio professional
              profile.
            </p>

            <div className="v3-badges">
              <span>
                <UserRound size={16} />
                {fullName}
              </span>

              <span>
                <BriefcaseBusiness size={16} />
                {trade}
              </span>

              {tradie.phone && (
                <span>
                  <Phone size={16} />
                  {tradie.phone}
                </span>
              )}

              {tradie.email && (
                <span>
                  <Mail size={16} />
                  {tradie.email}
                </span>
              )}
            </div>
          </div>

          <div className="v3-share-card">
            <strong>vekio.com.au/tradie/{tradie.slug}</strong>
            <span>One profile. One direct enquiry point.</span>
          </div>
        </section>

        <section className="tradie-v3-grid">
          <aside className="v3-enquiry card">
            <div className="eyebrow">Request a quote</div>

            <h2>Tell {firstName} what you need.</h2>

            <p>
              Send the details once. {firstName} will receive the enquiry
              directly.
            </p>

            <form
              className="enquiry-form"
              onSubmit={(event) => {
                event.preventDefault();
                sendEnquiry();
              }}
            >
              <div className="field">
                <label>Your name</label>

                <input
                  type="text"
                  placeholder="Your name"
                  value={customerName}
                  onChange={(event) => setCustomerName(event.target.value)}
                />
              </div>

              <div className="field">
                <label>Phone</label>

                <input
                  type="tel"
                  placeholder="0412 345 678"
                  value={customerPhone}
                  onChange={(event) => setCustomerPhone(event.target.value)}
                />
              </div>

              <div className="field">
                <label>Email</label>

                <input
                  type="email"
                  placeholder="you@example.com"
                  value={customerEmail}
                  onChange={(event) => setCustomerEmail(event.target.value)}
                />
              </div>

              <div className="field">
                <label>Suburb or location</label>

                <input
                  type="text"
                  placeholder="Suburb, WA"
                  value={location}
                  onChange={(event) => setLocation(event.target.value)}
                />
              </div>

              <div className="field">
                <label>Job details</label>

                <textarea
                  placeholder="Describe the work you need..."
                  value={jobDetails}
                  onChange={(event) => setJobDetails(event.target.value)}
                />
              </div>

              <button
                className="btn btn-primary btn-wide"
                type="submit"
                disabled={isSending}
                style={{
                  opacity: isSending ? 0.65 : 1,
                  cursor: isSending ? "not-allowed" : "pointer",
                }}
              >
                <Send size={18} />
                {isSending ? "Sending..." : "Send enquiry"}
              </button>

              {enquiryStatus && (
                <p
                  style={{
                    textAlign: "center",
                    color: "var(--brand-2)",
                  }}
                >
                  {enquiryStatus}
                </p>
              )}
            </form>
          </aside>

          <section className="v3-content">
            <div className="card v3-about">
              <h2>About {firstName}</h2>

              <p>
                <strong>{businessName}</strong>
                <br />
                {trade}
              </p>

              <p>
                This Vekio profile allows customers to send work enquiries
                directly to {fullName}.
              </p>
            </div>

            <div className="v3-two">
              <div className="card">
                <h2>Professional details</h2>

                <div className="credential">
                  <UserRound size={18} />

                  <div>
                    <strong>Contact person</strong>
                    <span>{fullName}</span>
                  </div>
                </div>

                <div className="credential">
                  <BriefcaseBusiness size={18} />

                  <div>
                    <strong>Trade or profession</strong>
                    <span>{trade}</span>
                  </div>
                </div>

                {tradie.phone && (
                  <div className="credential">
                    <Phone size={18} />

                    <div>
                      <strong>Phone</strong>
                      <span>{tradie.phone}</span>
                    </div>
                  </div>
                )}

                {tradie.email && (
                  <div className="credential">
                    <Mail size={18} />

                    <div>
                      <strong>Email</strong>
                      <span>{tradie.email}</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="card">
                <h2>Vekio profile</h2>

                <div className="credential">
                  <BadgeCheck size={18} />

                  <div>
                    <strong>Vekio ID created</strong>
                    <span>Public professional profile</span>
                  </div>
                </div>

                <div className="credential">
                  <MapPin size={18} />

                  <div>
                    <strong>Service area</strong>
                    <span>Ask the tradie directly</span>
                  </div>
                </div>

                <div className="credential">
                  <Mail size={18} />

                  <div>
                    <strong>Direct enquiries</strong>
                    <span>Delivered to the tradie</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <h2>Need work done?</h2>

              <p>
                Use the enquiry form to send your job details directly to{" "}
                {firstName}.
              </p>
            </div>
          </section>
        </section>
      </section>
    </main>
  );
}