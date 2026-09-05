"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { LockKeyhole, Search, ShieldCheck } from "lucide-react";

export default function VekioProLoginPage() {
  const [status, setStatus] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("Separate Vekio Pro authentication will be connected in the next build step.");
  }

  return (
    <main className="login-wrap">
      <section className="login-left">
        <Link className="logo" href="/pro">
          <span className="logo-mark">V</span>
          <span>Vekio Pro</span>
        </Link>

        <div style={{ marginTop: 70 }}>
          <div className="eyebrow">Vekio Pro</div>
          <h1>Professional discovery starts here.</h1>
          <p>Sign in to your separate Pro workspace to search participating Vekio profiles.</p>
        </div>

        <div className="trust-strip">
          <div className="trust-item"><Search size={20} /><strong>Search</strong><span>the network</span></div>
          <div className="trust-item"><ShieldCheck size={20} /><strong>Permissioned</strong><span>discovery</span></div>
          <div className="trust-item"><LockKeyhole size={20} /><strong>Separate</strong><span>access</span></div>
        </div>
      </section>

      <section className="login-right">
        <form className="card form-card" onSubmit={handleSubmit}>
          <h2>Pro sign in</h2>
          <p>Use your Vekio Pro credentials.</p>

          <div className="field">
            <label>Work email</label>
            <input type="email" required />
          </div>
          <div className="field">
            <label>Password</label>
            <input type="password" required />
          </div>

          <button className="btn" type="submit" style={{ width: "100%", justifyContent: "center" }}>
            Sign in
          </button>

          {status && <p style={{ marginTop: 16 }}>{status}</p>}

          <p style={{ marginTop: 20, fontSize: 14, opacity: 0.7 }}>
            Need Pro access? <Link href="/pro/register">Create a Pro account</Link>
          </p>
        </form>
      </section>
    </main>
  );
}
