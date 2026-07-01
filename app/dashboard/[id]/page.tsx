"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  BadgeCheck,
  ClipboardCheck,
  FileCheck2,
  ImagePlus,
  Link2,
  Mail,
  Phone,
  ShieldCheck,
  Star,
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
};

export default function DashboardPage() {
  const params = useParams();
  const slug = params.id as string;

  const [tradie, setTradie] = useState<Tradie | null>(null);
  const [loading, setLoading] = useState(true);
  const [debugError, setDebugError] = useState<any>(null);

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

  if (loading) {
    return (
      <main style={{ padding: 40, color: "white", background: "#07111f" }}>
        <h1>Loading dashboard...</h1>
      </main>
    );
  }

  if (!tradie) {
    return (
      <main style={{ padding: 40, color: "white", background: "#07111f" }}>
        <h1>Dashboard not found</h1>
        <p>
          <strong>Slug searched:</strong> {slug}
        </p>
        <pre>{JSON.stringify(debugError, null, 2)}</pre>
      </main>
    );
  }

  const businessName = tradie.business_name || "Vekio Professional";
  const fullName = tradie.full_name || "Professional";
  const trade = tradie.trade || "Professional";
  const firstName = fullName.split(" ")[0] || "Professional";

  const completionItems = [
    { label: "Basic profile created", done: true },
    { label: "Public profile live", done: true },
    { label: "Phone added", done: Boolean(tradie.phone) },
    { label: "Email added", done: Boolean(tradie.email) },
    { label: "Licence uploaded", done: false },
    { label: "Insurance uploaded", done: false },
    { label: "Project photos added", done: false },
    { label: "First review received", done: false },
  ];

  const completeCount = completionItems.filter((item) => item.done).length;
  const completionPercent = Math.round(
    (completeCount / completionItems.length) * 100
  );

  return (
    <main className="page-shell">
      <nav className="nav">
        <Link className="logo" href="/">
          <span className="logo-mark">V</span>
          <span>Vekio</span>
        </Link>

        <div className="nav-links">
          <Link href={`/tradie/${tradie.slug}`}>View public profile</Link>
          <Link href="/login">Logout</Link>
        </div>
      </nav>

      <section className="tradie-v3">
        <section className="tradie-v3-hero card">
          <div className="hero-glow" />

          <div className="tradie-v3-avatar">
            {businessName
              .split(" ")
              .map((word) => word[0])
              .join("")
              .slice(0, 2)
              .toUpperCase()}
          </div>

          <div className="tradie-v3-hero-copy">
            <div className="verified-pill">
              <BadgeCheck size={16} />
              Dashboard
            </div>

            <h1>Welcome, {firstName}</h1>
            <p>
              Manage your Vekio ID for <strong>{businessName}</strong>.
            </p>

            <div className="v3-badges">
              <span>
                <UserRound size={16} /> {fullName}
              </span>
              <span>
                <ClipboardCheck size={16} /> {trade}
              </span>
              <span>
                <Phone size={16} /> {tradie.phone || "Phone missing"}
              </span>
              <span>
                <Mail size={16} /> {tradie.email || "Email missing"}
              </span>
            </div>
          </div>

          <div className="v3-share-card">
            <strong>Profile {completionPercent}% complete</strong>
            <span>Finish your profile to build stronger trust.</span>
          </div>
        </section>

        <section className="tradie-v3-grid">
          <aside className="v3-enquiry card">
            <div className="eyebrow">Profile completion</div>
            <h2>{completionPercent}% complete</h2>
            <p>
              Complete the trust layer before sharing your profile widely.
            </p>

            <div style={{ marginTop: 18 }}>
              <div
                style={{
                  height: 12,
                  borderRadius: 999,
                  background: "rgba(255,255,255,.08)",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${completionPercent}%`,
                    height: "100%",
                    background:
                      "linear-gradient(90deg, var(--brand), var(--brand-2))",
                  }}
                />
              </div>
            </div>

            <div className="v3-list" style={{ marginTop: 22 }}>
              {completionItems.map((item) => (
                <span key={item.label}>
                  <ShieldCheck size={18} />
                  {item.done ? "✅" : "⬜"} {item.label}
                </span>
              ))}
            </div>

            <Link
              className="btn btn-primary btn-wide"
              href={`/tradie/${tradie.slug}`}
              style={{ marginTop: 22 }}
            >
              <Link2 size={18} />
              Preview public profile
            </Link>
          </aside>

          <section className="v3-content">
            <div className="v3-proof-strip">
              <div className="card proof-stat">
                <strong>0</strong>
                <span>New enquiries</span>
              </div>
              <div className="card proof-stat">
                <strong>0</strong>
                <span>Documents uploaded</span>
              </div>
              <div className="card proof-stat">
                <strong>1</strong>
                <span>Public profile live</span>
              </div>
            </div>

            <div className="card v3-about">
              <h2>Business details</h2>
              <p>
                <strong>Business:</strong> {businessName}
                <br />
                <strong>Owner:</strong> {fullName}
                <br />
                <strong>Trade:</strong> {trade}
                <br />
                <strong>Phone:</strong> {tradie.phone || "Not added"}
                <br />
                <strong>Email:</strong> {tradie.email || "Not added"}
              </p>
            </div>

            <div className="v3-two">
              <div className="card">
                <h2>Trust documents</h2>

                <div className="credential">
                  <FileCheck2 size={18} />
                  <div>
                    <strong>Trade licence</strong>
                    <span>Upload required</span>
                  </div>
                </div>

                <div className="credential">
                  <ShieldCheck size={18} />
                  <div>
                    <strong>Insurance</strong>
                    <span>Upload required</span>
                  </div>
                </div>

                <div className="credential">
                  <BadgeCheck size={18} />
                  <div>
                    <strong>ABN</strong>
                    <span>Verification pending</span>
                  </div>
                </div>
              </div>

              <div className="card">
                <h2>Profile assets</h2>

                <div className="credential">
                  <ImagePlus size={18} />
                  <div>
                    <strong>Profile photo</strong>
                    <span>Not uploaded</span>
                  </div>
                </div>

                <div className="credential">
                  <ImagePlus size={18} />
                  <div>
                    <strong>Project gallery</strong>
                    <span>Add proof of work</span>
                  </div>
                </div>

                <div className="credential">
                  <Star size={18} />
                  <div>
                    <strong>Reviews</strong>
                    <span>No reviews yet</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <h2>Next actions</h2>
              <div className="v3-list">
                <span>
                  <FileCheck2 size={18} /> Upload trade licence
                </span>
                <span>
                  <ShieldCheck size={18} /> Upload insurance certificate
                </span>
                <span>
                  <ImagePlus size={18} /> Add first project photo
                </span>
                <span>
                  <Link2 size={18} /> Copy and share public Vekio link
                </span>
              </div>
            </div>
          </section>
        </section>
      </section>
    </main>
  );
}