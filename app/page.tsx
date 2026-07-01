import Link from 'next/link';
import { ArrowRight, BadgeCheck, Bell, BriefcaseBusiness, ShieldCheck, Sparkles, Users } from 'lucide-react';

export default function HomePage() {
  return (
    <main className="page-shell">
      <nav className="nav">
        <Link className="logo" href="/">
          <span className="logo-mark">V</span>
          <span>Vekio</span>
        </Link>
        <div className="nav-links">
          <a href="#how">How it works</a>
          <a href="#trust">Trust layer</a>
          <Link href="/tradie/john-smith">View Tradie ID</Link>
          <Link className="btn btn-secondary" href="/login">Login</Link>
        </div>
      </nav>

      <section className="hero">
        <div>
          <div className="eyebrow">Professional identity, one link</div>
          <h1>Your work history. Your proof. Your trust layer.</h1>
          <p>
            Vekio gives tradies, professionals, and hiring companies a single trusted profile to share licences,
            credentials, reviews, project history, availability, and enquiries without chasing paperwork every time.
          </p>
          <div className="hero-actions">
            <Link className="btn btn-primary" href="/login">Create your Vekio ID <ArrowRight size={18} /></Link>
            <Link className="btn btn-secondary" href="/tradie/john-smith">Preview Tradie ID</Link>
          </div>
        </div>

        <div className="card demo-card">
          <div className="profile-row">
            <div className="avatar">RE</div>
            <div>
              <div className="badge"><BadgeCheck size={14}/> Verified Vekio ID</div>
              <h3 style={{marginTop: 12}}>John Smith Services</h3>
              <p style={{margin: 0}}>Perth metro · Residential & commercial electrical</p>
            </div>
          </div>
          <div className="trust-strip">
            <div className="trust-item"><strong>4.9</strong><span>rating</span></div>
            <div className="trust-item"><strong>12</strong><span>docs verified</span></div>
            <div className="trust-item"><strong>24h</strong><span>avg reply</span></div>
          </div>
          <div className="section">
            <h3>Client enquiry received</h3>
            <p>“Need a switchboard upgrade in Brabham. Can you quote this week?”</p>
            <span className="badge"><Bell size={14}/> Tradie notified instantly</span>
          </div>
        </div>
      </section>

      <section id="how" className="grid-3">
        <div className="card feature">
          <div className="feature-icon"><ShieldCheck /></div>
          <h3>Create one professional ID</h3>
          <p>Upload qualifications, licences, ABN, insurance, photos, experience, service areas, and availability once.</p>
        </div>
        <div className="card feature">
          <div className="feature-icon"><Users /></div>
          <h3>Share it everywhere</h3>
          <p>Homeowners, builders, agencies, recruiters, and hiring companies can view one clean profile link.</p>
        </div>
        <div className="card feature">
          <div className="feature-icon"><BriefcaseBusiness /></div>
          <h3>Receive enquiries</h3>
          <p>Clients fill a form directly on the profile. The professional gets notified and can respond quickly.</p>
        </div>
      </section>

      <section id="trust" className="grid-3" style={{paddingTop: 0}}>
        <div className="card feature">
          <div className="feature-icon"><Sparkles /></div>
          <h3>For tradies</h3>
          <p>A simple trust profile that replaces scattered screenshots, PDFs, old references, and missed calls.</p>
        </div>
        <div className="card feature">
          <div className="feature-icon"><Sparkles /></div>
          <h3>For normal people</h3>
          <p>Find someone with proof, not just a name and a phone number floating around online.</p>
        </div>
        <div className="card feature">
          <div className="feature-icon"><Sparkles /></div>
          <h3>For hiring companies</h3>
          <p>Shortlist verified professionals faster, with less document chasing and more confidence.</p>
        </div>
      </section>
    </main>
  );
}
