"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { KeyRound } from "lucide-react";
import { supabase } from "../../lib/supabase";

export default function ActivateAccountPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleActivate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading) return;
    if (password.length < 8) { setStatus("Use a password with at least 8 characters."); return; }
    setLoading(true);
    setStatus("Checking your Vekio profile...");

    const normalizedEmail = email.trim();
    const { data: tradie, error: lookupError } = await supabase.from("tradies").select("slug").eq("email", normalizedEmail).maybeSingle();
    if (lookupError || !tradie?.slug) { setStatus("No existing Vekio profile was found for that email."); setLoading(false); return; }

    const { data, error } = await supabase.auth.signUp({ email: normalizedEmail, password });
    if (error) { setStatus(error.message); setLoading(false); return; }

    if (data.session) {
      router.push(`/dashboard/${tradie.slug}`);
      return;
    }

    setStatus("Access created. Check your email for Supabase's confirmation link, then log in.");
    setLoading(false);
  }

  return (
    <main className="login-wrap">
      <section className="login-left"><Link className="logo" href="/"><span className="logo-mark">V</span><span>Vekio</span></Link><div style={{marginTop:70}}><div className="eyebrow">Existing profile</div><h1>Turn your profile into a login.</h1><p>Use the same email address you used when you created your Vekio profile.</p></div></section>
      <section className="login-right">
        <form className="card form-card" onSubmit={handleActivate}>
          <KeyRound size={28}/><h2 style={{marginTop:14}}>Set up access</h2>
          <p>This is for profiles created before Vekio login authentication was connected.</p>
          <div className="field"><label>Existing profile email</label><input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" /></div>
          <div className="field"><label>Create password</label><input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="At least 8 characters" autoComplete="new-password" /></div>
          <button className="btn btn-primary btn-wide" type="submit" disabled={loading}>{loading ? "Setting up..." : "Set up my login"}</button>
          {status && <p style={{textAlign:"center", color:"var(--brand-2)"}}>{status}</p>}
          <p style={{textAlign:"center"}}><Link href="/login" style={{color:"var(--brand-2)"}}>Back to login</Link></p>
        </form>
      </section>
    </main>
  );
}
