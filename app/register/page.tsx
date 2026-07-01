"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, ShieldCheck, UserRoundPlus } from "lucide-react";
import { supabase } from "../../lib/supabase";

function makeSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function RegisterPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [trade, setTrade] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");

  async function handleCreateAccount() {
    setStatus("Saving...");

    const slug = makeSlug(businessName || fullName);

    const { error } = await supabase.from("tradies").insert({
      full_name: fullName,
      business_name: businessName,
      trade,
      phone,
      email,
      slug,
    });

    if (error) {
      console.error(error);
      setStatus("Something went wrong. Check console.");
      return;
    }

    setStatus("Vekio ID created successfully.");
    router.push(`/dashboard/${slug}`);
  }

  return (
    <main className="login-wrap">
      <section className="login-left">
        <Link className="logo" href="/">
          <span className="logo-mark">V</span>
          <span>Vekio</span>
        </Link>

        <div style={{ marginTop: 70 }}>
          <div className="eyebrow">Create your Vekio ID</div>
          <h1>Your professional identity starts here.</h1>
          <p>
            Create one trusted profile to share your licences, credentials,
            reviews, availability and enquiries.
          </p>
        </div>

        <div className="trust-strip">
          <div className="trust-item">
            <ShieldCheck size={20} />
            <strong>Verified</strong>
            <span>credentials</span>
          </div>

          <div className="trust-item">
            <UserRoundPlus size={20} />
            <strong>One ID</strong>
            <span>share everywhere</span>
          </div>
        </div>
      </section>

      <section className="login-right">
        <form className="card form-card">
          <h2>Create Account</h2>
          <p>Start building your Vekio profile.</p>

          <div className="field">
            <label>Full name</label>
            <input
              type="text"
              placeholder="John Smith"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>

          <div className="field">
            <label>Business name</label>
            <input
              type="text"
              placeholder="John Smith Services"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
            />
          </div>

          <div className="field">
            <label>Trade or profession</label>
            <input
              type="text"
              placeholder="Electrician, carpenter, engineer..."
              value={trade}
              onChange={(e) => setTrade(e.target.value)}
            />
          </div>

          <div className="field">
            <label>Phone</label>
            <input
              type="tel"
              placeholder="0412 345 678"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div className="field">
            <label>Email address</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="field">
            <label>Password</label>
            <input type="password" placeholder="••••••••" />
          </div>

          <button
            className="btn btn-primary btn-wide"
            type="button"
            onClick={handleCreateAccount}
          >
            Create Vekio ID <ArrowRight size={18} />
          </button>

          {status && (
            <p style={{ textAlign: "center", color: "var(--brand-2)" }}>
              {status}
            </p>
          )}

          <p style={{ textAlign: "center" }}>
            Already have an account?{" "}
            <Link href="/login" style={{ color: "var(--brand-2)" }}>
              Log in
            </Link>
          </p>
        </form>
      </section>
    </main>
  );
}