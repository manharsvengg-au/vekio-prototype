"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Eye, EyeOff, Fingerprint, LockKeyhole, ShieldCheck } from "lucide-react";
import { supabase } from "../../lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    if (params.get("confirmed") === "1") {
      setStatus("Email confirmed ✓ You can now log in to Vekio.");
      return;
    }

    if (params.get("checkEmail") === "1") {
      setStatus("Account created. Check your email and confirm your address before logging in.");
    }
  }, []);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading) return;

    if (!email.trim() || !password) {
      setStatus("Enter your email address and password.");
      return;
    }

    setLoading(true);
    setStatus("Signing you in...");

    const { error: authError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (authError) {
      const message = authError.message.toLowerCase();
      if (message.includes("email not confirmed")) {
        setStatus("Please confirm your email address first, then log in.");
      } else {
        setStatus("That login did not work. Check your details or reset your password.");
      }
      setLoading(false);
      return;
    }

    const { data: claimedSlug, error: claimError } = await supabase.rpc("claim_tradie_profile");

    if (claimError || !claimedSlug) {
      await supabase.auth.signOut();
      setStatus("Login succeeded, but Vekio could not connect this login to a profile.");
      setLoading(false);
      return;
    }

    router.push(`/dashboard/${claimedSlug}`);
  }

  return (
    <main className="login-wrap">
      <section className="login-left">
        <Link className="logo" href="/"><span className="logo-mark">V</span><span>Vekio</span></Link>
        <div style={{marginTop: 70}}>
          <div className="eyebrow">Welcome back</div>
          <h1>Your professional identity is waiting.</h1>
          <p>Log in to manage your Vekio ID, update your documents, check client enquiries, and keep your trust profile current.</p>
        </div>
        <div className="trust-strip">
          <div className="trust-item"><ShieldCheck size={20}/><strong>Verified</strong><span>credentials</span></div>
          <div className="trust-item"><Fingerprint size={20}/><strong>One ID</strong><span>share anywhere</span></div>
          <div className="trust-item"><LockKeyhole size={20}/><strong>Secure</strong><span>by design</span></div>
        </div>
      </section>

      <section className="login-right">
        <form className="card form-card" onSubmit={handleLogin}>
          <h2>Log in</h2>
          <p>Enter your details to access your dashboard.</p>
          <div className="field">
            <label>Email address</label>
            <input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
          </div>
          <div className="field">
            <div style={{display:"flex", justifyContent:"space-between", gap:12, alignItems:"center"}}>
              <label>Password</label>
              <Link href="/forgot-password" style={{color:"var(--brand-2)", fontSize:13}}>Forgot password?</Link>
            </div>
            <div className="password-wrap">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
              <button
                className="password-toggle"
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <button className="btn btn-primary btn-wide" type="submit" disabled={loading} style={{opacity:loading ? .65 : 1}}>
            {loading ? "Signing in..." : "Continue"} {!loading && <ArrowRight size={18}/>} 
          </button>
          {status && <p style={{textAlign:"center", color:"var(--brand-2)"}}>{status}</p>}
          <p style={{textAlign:'center'}}>New to Vekio? <Link href="/register" style={{color:'var(--brand-2)'}}>Join for free</Link></p>
          <p style={{textAlign:'center', fontSize:13}}>Already made a profile before login was added? <Link href="/activate-account" style={{color:'var(--brand-2)'}}>Set up access</Link></p>
        </form>
      </section>
    </main>
  );
}
