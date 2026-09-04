"use client";

import Link from "next/link";
import { ChangeEvent, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Camera,
  ShieldCheck,
  UserRoundPlus,
} from "lucide-react";
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
  const [password, setPassword] = useState("");
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState("");

  const [status, setStatus] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  function handlePhotoChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setStatus("Please choose an image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setStatus("Profile photo must be smaller than 5 MB.");
      return;
    }

    setProfilePhoto(file);
    setPhotoPreview(URL.createObjectURL(file));
    setStatus("");
  }

  async function uploadProfilePhoto(slug: string) {
    if (!profilePhoto) {
      return null;
    }

    const fileExtension =
      profilePhoto.name.split(".").pop()?.toLowerCase() || "jpg";

    const uniqueFileName = `${slug}-${Date.now()}.${fileExtension}`;
    const filePath = `profiles/${uniqueFileName}`;

    const { error: uploadError } = await supabase.storage
      .from("tradie-profile-photos")
      .upload(filePath, profilePhoto, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      throw uploadError;
    }

    const { data } = supabase.storage
      .from("tradie-profile-photos")
      .getPublicUrl(filePath);

    return data.publicUrl;
  }

  async function handleCreateAccount() {
    if (isSaving) {
      return;
    }

    if (!fullName.trim()) {
      setStatus("Please enter your full name.");
      return;
    }

    if (!businessName.trim()) {
      setStatus("Please enter your business name.");
      return;
    }

    if (!trade.trim()) {
      setStatus("Please enter your trade or profession.");
      return;
    }

    if (!phone.trim()) {
      setStatus("Please enter your phone number.");
      return;
    }

    if (!email.trim()) {
      setStatus("Please enter your email address.");
      return;
    }

    if (!profilePhoto) {
      setStatus("Please add a profile photo.");
      return;
    }

    if (password.length < 8) {
      setStatus("Please choose a password with at least 8 characters.");
      return;
    }

    setIsSaving(true);
    setStatus("Uploading profile photo...");

    try {
      const slug = makeSlug(businessName || fullName);

      if (!slug) {
        setStatus("Please enter a valid business name or full name.");
        setIsSaving(false);
        return;
      }

      const profilePhotoUrl = await uploadProfilePhoto(slug);

      setStatus("Creating your secure login...");

      const { error: authError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
      });

      if (authError) {
        throw authError;
      }

      setStatus("Creating your Vekio ID...");

      const { error: insertError } = await supabase.from("tradies").insert({
        full_name: fullName.trim(),
        business_name: businessName.trim(),
        trade: trade.trim(),
        phone: phone.trim(),
        email: email.trim(),
        marketing_consent: marketingConsent,
        slug,
        profile_photo_url: profilePhotoUrl,
      });

      if (insertError) {
        throw insertError;
      }

      setStatus("Vekio ID created successfully.");
      router.push(`/dashboard/${slug}`);
    } catch (error) {
      console.error("Registration error:", error);
      setStatus("Something went wrong. Check the browser console.");
      setIsSaving(false);
    }
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
        <form
          className="card form-card"
          onSubmit={(event) => {
            event.preventDefault();
            handleCreateAccount();
          }}
        >
          <h2>Create Account</h2>
          <p>Start building your Vekio profile.</p>

          <div className="field">
            <label>Profile photo</label>

            <label
              htmlFor="profile-photo"
              style={{
                minHeight: 150,
                border: "2px dashed rgba(255, 255, 255, 0.18)",
                borderRadius: 16,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                gap: 10,
                cursor: "pointer",
                overflow: "hidden",
                textAlign: "center",
                padding: 16,
              }}
            >
              {photoPreview ? (
                <img
                  src={photoPreview}
                  alt="Profile preview"
                  style={{
                    width: 120,
                    height: 120,
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <>
                  <Camera size={32} />
                  <strong>Add profile photo</strong>
                  <span style={{ opacity: 0.7 }}>
                    Upload a clear photo of yourself
                  </span>
                </>
              )}
            </label>

            <input
              id="profile-photo"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handlePhotoChange}
              style={{ display: "none" }}
            />
          </div>

          <div className="field">
            <label>Full name</label>

            <input
              type="text"
              placeholder="John Smith"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
            />
          </div>

          <div className="field">
            <label>Business name</label>

            <input
              type="text"
              placeholder="John Smith Services"
              value={businessName}
              onChange={(event) => setBusinessName(event.target.value)}
            />
          </div>

          <div className="field">
            <label>Trade or profession</label>

            <input
              type="text"
              placeholder="Electrician, carpenter, engineer..."
              value={trade}
              onChange={(event) => setTrade(event.target.value)}
            />
          </div>

          <div className="field">
            <label>Phone</label>

            <input
              type="tel"
              placeholder="0412 345 678"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
            />
          </div>

          <div className="field">
            <label>Email address</label>

            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>

<div
  style={{
    display: "flex",
    alignItems: "flex-start",
    gap: 10,
    marginTop: 4,
  }}
>
  <input
    id="marketing-consent"
    type="checkbox"
    checked={marketingConsent}
    onChange={(event) => setMarketingConsent(event.target.checked)}
    style={{
      marginTop: 4,
      width: 18,
      height: 18,
      cursor: "pointer",
    }}
  />

  <label
    htmlFor="marketing-consent"
    style={{
      cursor: "pointer",
      lineHeight: 1.4,
      fontSize: 14,
      opacity: 0.85,
    }}
  >
    Send me Vekio tips, updates and opportunities by email. I can unsubscribe anytime.
  </label>
</div>
          
          <div className="field">
            <label>Password</label>
            <input type="password" placeholder="At least 8 characters" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="new-password" />
          </div>

          <button
            className="btn btn-primary btn-wide"
            type="submit"
            disabled={isSaving}
            style={{
              opacity: isSaving ? 0.65 : 1,
              cursor: isSaving ? "not-allowed" : "pointer",
            }}
          >
            {isSaving ? "Creating Vekio ID..." : "Create Vekio ID"}
            {!isSaving && <ArrowRight size={18} />}
          </button>

          {status && (
            <p
              style={{
                textAlign: "center",
                color: "var(--brand-2)",
              }}
            >
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
