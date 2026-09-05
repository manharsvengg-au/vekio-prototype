"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { ArrowRight, Building2, CreditCard, ShieldCheck } from "lucide-react";

export default function VekioProRegisterPage() {
  const [status, setStatus] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("Pro account creation and billing will be connected in the next build step.");
  }

  return (
    <main className="login-wrap">
      <section className="login-left">
        <Link className="logo" href="/pro">
          <span className="logo-mark">V</span>
          <span>Vekio Pro</span>
        </Link>

        <div style={{ marginTop: 70 }}>
          <div className="eyebrow">Professional access</div>
          <h1>Create your Vekio Pro account.</h1>
          <p>
            Pro is a separate access layer for legitimate recruitment, hiring,
            contracting, procurement and workforce discovery.
          </p>
        </div>

        <div className="trust-strip">
          <div className="trust-item"><ShieldCheck size={20} /><strong>Controlled</strong><span>access</span></div>
          <div className="trust-item"><Building2 size={20} /><strong>Professional</strong><span>use</span></div>
          <div className="trust-item"><CreditCard size={20} /><strong>Paid</strong><span>membership</span></div>
        </div>
      </section>

      <section className="login-right">
        <form className="card form-card" onSubmit={handleSubmit}>
          <h2>Get Pro access</h2>
          <p>A$39.99 for the first 3 months, then A$19.99/month.</p>

          <div className="field">
            <label>Full name</label>
            <input type="text" placeholder="Your name" required />
          </div>
          <div className="field">
            <label>Organisation</label>
            <input type="text" placeholder="Company or organisation" required />
          </div>
          <div className="field">
            <label>Role</label>
            <input type="text" placeholder="Recruiter, project manager, director..." required />
          </div>
          <div className="field">
            <label>Work email</label>
            <input type="email" placeholder="you@company.com" required />
          </div>
          <div className="field">
            <label>Primary purpose</label>
            <select required defaultValue="">
              <option value="" disabled>Select a purpose</option>
              <option>Recruitment / labour hire</option>
              <option>Hiring / employment</option>
              <option>Subcontractor discovery</option>
              <option>Procurement / supplier discovery</option>
              <option>Other professional use</option>
            </select>
          </div>

          <button className="btn" type="submit" style={{ width: "100%", justifyContent: "center" }}>
            Continue to payment <ArrowRight size={18} />
          </button>

          {status && <p style={{ marginTop: 16 }}>{status}</p>}

          <p style={{ marginTop: 20, fontSize: 14, opacity: 0.7 }}>
            Already have Pro? <Link href="/pro/login">Sign in</Link>
          </p>
        </form>
      </section>
    </main>
  );
}
