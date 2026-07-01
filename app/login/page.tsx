import Link from 'next/link';
import { ArrowRight, Fingerprint, LockKeyhole, ShieldCheck } from 'lucide-react';

export default function LoginPage() {
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
        <form className="card form-card">
          <h2>Log in</h2>
          <p>Enter your details to access your dashboard.</p>
          <div className="field">
            <label>Email address</label>
            <input type="email" placeholder="you@example.com" />
          </div>
          <div className="field">
            <label>Password</label>
            <input type="password" placeholder="••••••••" />
          </div>
          <button className="btn btn-primary btn-wide" type="button">Continue <ArrowRight size={18}/></button>
          <p style={{textAlign:'center'}}>New to Vekio? <Link href="/tradie/John Smith" style={{color:'var(--brand-2)'}}>Preview a profile</Link></p>
        </form>
      </section>
    </main>
  );
}
