"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LockKeyhole } from "lucide-react";
import { supabase } from "../../lib/supabase";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState("Open the reset link from your email, then choose a new password.");
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setReady(Boolean(data.session)));
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" || session) setReady(true);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  async function handleUpdate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (password.length < 8) { setStatus("Use at least 8 characters for your new password."); return; }
    if (password !== confirmPassword) { setStatus("The two passwords do not match."); return; }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    if (error) { setStatus(error.message); setLoading(false); return; }
    setStatus("Password updated. Taking you back to login...");
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <main className="login-wrap">
      <section className="login-left"><Link className="logo" href="/"><span className="logo-mark">V</span><span>Vekio</span></Link><div style={{marginTop:70}}><div className="eyebrow">Secure recovery</div><h1>Choose a new password.</h1><p>Your new password will replace the old one immediately.</p></div></section>
      <section className="login-right">
        <form className="card form-card" onSubmit={handleUpdate}>
          <LockKeyhole size={28}/><h2 style={{marginTop:14}}>New password</h2>
          <div className="field"><label>New password</label><input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} autoComplete="new-password" /></div>
          <div className="field"><label>Confirm new password</label><input type="password" value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)} autoComplete="new-password" /></div>
          <button className="btn btn-primary btn-wide" type="submit" disabled={!ready || loading}>{loading ? "Updating..." : "Update password"}</button>
          <p style={{textAlign:"center", color:"var(--brand-2)"}}>{status}</p>
        </form>
      </section>
    </main>
  );
}
