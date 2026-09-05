import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  Search,
  ShieldCheck,
  UsersRound,
} from "lucide-react";

export default function VekioProPage() {
  return (
    <main className="page-shell">
      <nav className="nav">
        <Link className="logo" href="/pro">
          <span className="logo-mark">V</span>
          <span>Vekio Pro</span>
        </Link>

        <div className="nav-links">
          <Link href="/pro/login">Pro sign in</Link>
          <Link className="btn btn-small" href="/pro/register">
            Get Pro access
          </Link>
        </div>
      </nav>

      <section style={{ maxWidth: 1120, margin: "0 auto", padding: "72px 24px 96px" }}>
        <div style={{ maxWidth: 820 }}>
          <div className="eyebrow">A separate professional access layer</div>
          <h1 style={{ fontSize: "clamp(48px, 7vw, 86px)", lineHeight: 0.98, marginBottom: 24 }}>
            Find the people and businesses you need.
          </h1>
          <p style={{ maxWidth: 720, fontSize: 20, lineHeight: 1.6, opacity: 0.82 }}>
            Vekio Pro is built for recruiters, contractors, employers and organisations that need a faster way to discover relevant Vekio professionals — without turning private contact data into a public directory.
          </p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 34 }}>
            <Link className="btn" href="/pro/register">
              Start Vekio Pro <ArrowRight size={18} />
            </Link>
            <Link className="btn btn-secondary" href="/pro/login">
              Pro sign in
            </Link>
          </div>
        </div>

        <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginTop: 72 }}>
          <div className="card" style={{ padding: 24 }}>
            <Search size={28} />
            <h3>Search with purpose</h3>
            <p>Search participating Vekio profiles by profession, capability and location.</p>
          </div>
          <div className="card" style={{ padding: 24 }}>
            <ShieldCheck size={28} />
            <h3>Privacy stays intact</h3>
            <p>Pro access never overrides the privacy choices of a Vekio ID owner.</p>
          </div>
          <div className="card" style={{ padding: 24 }}>
            <UsersRound size={28} />
            <h3>Professional discovery</h3>
            <p>Find relevant people without waiting for someone to forward you a profile link.</p>
          </div>
          <div className="card" style={{ padding: 24 }}>
            <Building2 size={28} />
            <h3>Built for organisations</h3>
            <p>Recruitment, subcontracting, procurement, hiring and workforce discovery.</p>
          </div>
        </section>

        <section className="card" style={{ marginTop: 56, padding: 32, display: "grid", gridTemplateColumns: "minmax(0, 1.5fr) minmax(260px, 0.7fr)", gap: 28, alignItems: "center" }}>
          <div>
            <div className="verified-pill" style={{ width: "fit-content" }}>
              <BadgeCheck size={16} /> Founding Pro access
            </div>
            <h2 style={{ fontSize: 34, marginBottom: 12 }}>A$39.99 for your first 3 months.</h2>
            <p style={{ fontSize: 18, lineHeight: 1.6, opacity: 0.78, margin: 0 }}>
              Then A$19.99 per month. Card required. Cancel anytime. Paid access is designed to keep Vekio Pro a deliberate professional tool rather than an open browsing directory.
            </p>
          </div>
          <div>
            <Link className="btn" href="/pro/register" style={{ width: "100%", justifyContent: "center" }}>
              Create Pro account <ArrowRight size={18} />
            </Link>
          </div>
        </section>
      </section>
    </main>
  );
}
