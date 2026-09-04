"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { ArrowLeft, Mail } from "lucide-react";
import { supabase } from "../../lib/supabase";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleReset(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email.trim() || loading) return;
    setLoading(true);
    setStatus("Sending reset link...");

    const redirectTo = `${window.location.origin}/reset-password`;
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo });

    setStatus(error ? error.message : "If an account exists for that email, a password reset link has been sent.");
    setLoading(false);
  }

  return (
    <main className="login-wrap">
      <section className="login-left">
        <Link className="logo" href="/"><span className="logo-mark">V</span><span>Vekio</span></Link>
        <div style={{marginTop:70}}><div className="eyebrow">Account recovery</div><h1>Reset your password.</h1><p>We’ll email you a secure link to choose a new password.</p></div>
      </section>
      <section className="login-right">
        <form className="card form-card" onSubmit={handleReset}>
          <Mail size={28}/><h2 style={{marginTop:14}}>Forgot password?</h2>
          <p>Enter the email address connected to your Vekio account.</p>
          <div className="field"><label>Email address</label><input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" /></div>
          <button className="btn btn-primary btn-wide" type="submit" disabled={loading}>{loading ? "Sending..." : "Send reset link"}</button>
          {status && <p style={{textAlign:"center", color:"var(--brand-2)"}}>{status}</p>}
          <p style={{textAlign:"center"}}><Link href="/login" style={{color:"var(--brand-2)"}}><ArrowLeft size={14} style={{verticalAlign:"middle"}}/> Back to login</Link></p>
        </form>
      </section>
    </main>
  );
}
