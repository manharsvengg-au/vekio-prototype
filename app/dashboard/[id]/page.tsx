"use client";

import Link from "next/link";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  BadgeCheck,
  ClipboardCheck,
  FileCheck2,
  ImagePlus,
  Link2,
  Mail,
  Phone,
  ShieldCheck,
  Star,
  Printer,
  UserRound,
} from "lucide-react";
import { supabase } from "../../../lib/supabase";

type Tradie = {
  id: string;
  full_name: string | null;
  business_name: string | null;
  trade: string | null;
  phone: string | null;
  email: string | null;
  slug: string | null;
  profile_photo_url: string | null;
  trade_licence_path: string | null;
  insurance_path: string | null;
  project_photo_urls: string[] | null;
  service_area: string | null;
  about_business: string | null;
};

export default function DashboardPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.id as string;

  const [tradie, setTradie] = useState<Tradie | null>(null);
  const [loading, setLoading] = useState(true);
  const [debugError, setDebugError] = useState<any>(null);
  const [photoUploading, setPhotoUploading] = useState(false);
  const [photoStatus, setPhotoStatus] = useState("");
  const photoInputRef = useRef<HTMLInputElement | null>(null);
  const licenceInputRef = useRef<HTMLInputElement | null>(null);
  const insuranceInputRef = useRef<HTMLInputElement | null>(null);
  const projectInputRef = useRef<HTMLInputElement | null>(null);
  const [assetUploading, setAssetUploading] = useState<string | null>(null);
  const [assetStatus, setAssetStatus] = useState("");
  const [profileEditOpen, setProfileEditOpen] = useState(false);
  const [serviceArea, setServiceArea] = useState("");
  const [aboutBusiness, setAboutBusiness] = useState("");
  const [profileSaveStatus, setProfileSaveStatus] = useState("");
  const [profileSaving, setProfileSaving] = useState(false);
  const [newEnquiries, setNewEnquiries] = useState(0);

  useEffect(() => {
    let alive = true;

    async function loadTradie() {
      setLoading(true);

      const { data: authData, error: authError } = await supabase.auth.getUser();
      const user = authData.user;

      if (!alive) return;

      if (authError || !user) {
        setTradie(null);
        setLoading(false);
        router.replace("/login");
        return;
      }

      const { data, error } = await supabase
        .from("tradies")
        .select("*")
        .eq("slug", slug)
        .eq("auth_user_id", user.id)
        .single();

      if (!alive) return;

      if (error) {
        console.error(error);
        setDebugError(error);
        setTradie(null);
      } else {
        setTradie(data);
        setServiceArea(data.service_area || "");
        setAboutBusiness(data.about_business || "");

        const { count } = await supabase
          .from("enquiries")
          .select("id", { count: "exact", head: true })
          .eq("tradie_id", data.id)
          .eq("status", "new");
        setNewEnquiries(count || 0);
      }

      setLoading(false);
    }

    function handlePageShow(event: PageTransitionEvent) {
      if (event.persisted) {
        loadTradie();
      }
    }

    const { data: listener } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") {
        setTradie(null);
        window.location.replace("/login");
      }
    });

    window.addEventListener("pageshow", handlePageShow);

    if (slug) {
      loadTradie();
    }

    return () => {
      alive = false;
      window.removeEventListener("pageshow", handlePageShow);
      listener.subscription.unsubscribe();
    };
  }, [slug, router]);

  async function handleProfilePhotoUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file || !tradie) return;

    setPhotoStatus("");

    if (!file.type.startsWith("image/")) {
      setPhotoStatus("Choose a JPG, PNG or other image file.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setPhotoStatus("Image must be smaller than 5 MB.");
      event.target.value = "";
      return;
    }

    setPhotoUploading(true);

    try {
      const { data: authData, error: authError } = await supabase.auth.getUser();
      if (authError || !authData.user) {
        throw new Error("Your login session has expired. Please log in again.");
      }

      const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const safeSlug = tradie.slug || tradie.id;
      const filePath = `profiles/${authData.user.id}/${safeSlug}-${Date.now()}.${extension}`;

      const { error: uploadError } = await supabase.storage
        .from("tradie-profile-photos")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
          contentType: file.type,
        });

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from("tradie-profile-photos")
        .getPublicUrl(filePath);

      const publicUrl = publicUrlData.publicUrl;

      const { error: updateError } = await supabase
        .from("tradies")
        .update({ profile_photo_url: publicUrl })
        .eq("id", tradie.id);

      if (updateError) throw updateError;

      setTradie({ ...tradie, profile_photo_url: publicUrl });
      setPhotoStatus("Profile image saved. Print.Vekio will use it automatically.");
    } catch (error: any) {
      console.error("Profile image upload failed:", error);
      setPhotoStatus(error?.message || "Image upload failed. Please try again.");
    } finally {
      setPhotoUploading(false);
      event.target.value = "";
    }
  }

  function chooseProfilePhoto() {
    photoInputRef.current?.click();
  }

  async function handleDocumentUpload(event: ChangeEvent<HTMLInputElement>, kind: "licence" | "insurance") {
    const file = event.target.files?.[0];
    if (!file || !tradie) return;
    setAssetStatus("");
    const allowed = ["application/pdf", "image/jpeg", "image/png", "image/webp"];
    if (!allowed.includes(file.type)) { setAssetStatus("Use PDF, JPG, PNG or WebP."); event.target.value=""; return; }
    if (file.size > 10 * 1024 * 1024) { setAssetStatus("Document must be smaller than 10 MB."); event.target.value=""; return; }
    setAssetUploading(kind);
    try {
      const { data: authData, error: authError } = await supabase.auth.getUser();
      if (authError || !authData.user) throw new Error("Your login session has expired. Please log in again.");
      const ext = file.name.split(".").pop()?.toLowerCase() || "pdf";
      const filePath = `${kind}/${authData.user.id}/${tradie.slug || tradie.id}-${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage.from("tradie-documents").upload(filePath, file, { cacheControl:"3600", upsert:false, contentType:file.type });
      if (uploadError) throw uploadError;
      const column = kind === "licence" ? "trade_licence_path" : "insurance_path";
      const { error: updateError } = await supabase.from("tradies").update({ [column]: filePath }).eq("id", tradie.id);
      if (updateError) throw updateError;
      setTradie({ ...tradie, [column]: filePath } as Tradie);
      setAssetStatus(`${kind === "licence" ? "Trade licence" : "Insurance certificate"} saved.`);
    } catch (error:any) { setAssetStatus(error?.message || "Upload failed. Please try again."); }
    finally { setAssetUploading(null); event.target.value=""; }
  }

  async function handleProjectPhotoUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file || !tradie) return;
    setAssetStatus("");
    if (!file.type.startsWith("image/")) { setAssetStatus("Choose an image file."); event.target.value=""; return; }
    if (file.size > 8 * 1024 * 1024) { setAssetStatus("Project image must be smaller than 8 MB."); event.target.value=""; return; }
    setAssetUploading("project");
    try {
      const { data: authData, error: authError } = await supabase.auth.getUser();
      if (authError || !authData.user) throw new Error("Your login session has expired. Please log in again.");
      const ext=file.name.split(".").pop()?.toLowerCase() || "jpg";
      const filePath=`projects/${authData.user.id}/${tradie.slug || tradie.id}-${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage.from("tradie-project-photos").upload(filePath,file,{cacheControl:"3600",upsert:false,contentType:file.type});
      if (uploadError) throw uploadError;
      const { data: publicUrlData }=supabase.storage.from("tradie-project-photos").getPublicUrl(filePath);
      const next=[...(tradie.project_photo_urls || []), publicUrlData.publicUrl];
      const { error:updateError }=await supabase.from("tradies").update({project_photo_urls:next}).eq("id",tradie.id);
      if(updateError) throw updateError;
      setTradie({...tradie,project_photo_urls:next});
      setAssetStatus("Project photo added.");
    } catch(error:any){ setAssetStatus(error?.message || "Upload failed. Please try again."); }
    finally{ setAssetUploading(null); event.target.value=""; }
  }

  async function savePublicDetails() {
    if (!tradie) return;
    setProfileSaving(true);
    setProfileSaveStatus("");
    try {
      const { error } = await supabase
        .from("tradies")
        .update({
          service_area: serviceArea.trim() || null,
          about_business: aboutBusiness.trim() || null,
        })
        .eq("id", tradie.id);
      if (error) throw error;
      setTradie({
        ...tradie,
        service_area: serviceArea.trim() || null,
        about_business: aboutBusiness.trim() || null,
      });
      setProfileSaveStatus("Public details saved.");
      setProfileEditOpen(false);
    } catch (error: any) {
      setProfileSaveStatus(error?.message || "Could not save details.");
    } finally {
      setProfileSaving(false);
    }
  }

  if (loading) {
    return (
      <main style={{ padding: 40, color: "white", background: "#07111f" }}>
        <h1>Loading dashboard...</h1>
      </main>
    );
  }

  if (!tradie) {
    return (
      <main style={{ padding: 40, color: "white", background: "#07111f" }}>
        <h1>Dashboard not found</h1>
        <p>
          <strong>Slug searched:</strong> {slug}
        </p>
        <pre>{JSON.stringify(debugError, null, 2)}</pre>
      </main>
    );
  }

  const businessName = tradie.business_name || "Vekio Professional";
  const fullName = tradie.full_name || "Professional";
  const trade = tradie.trade || "Professional";
  const firstName = fullName.split(" ")[0] || "Professional";

  const initials = businessName
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const completionItems = [
    { label: "Basic profile created", done: true },
    { label: "Public profile live", done: true },
    { label: "Phone added", done: Boolean(tradie.phone) },
    { label: "Email added", done: Boolean(tradie.email) },
    { label: "Profile photo added", done: Boolean(tradie.profile_photo_url) },
    { label: "Licence uploaded", done: Boolean(tradie.trade_licence_path) },
    { label: "Insurance uploaded", done: Boolean(tradie.insurance_path) },
    { label: "Project photos added", done: Boolean(tradie.project_photo_urls?.length) },
    { label: "First review received", done: false },
  ];

  const completeCount = completionItems.filter((item) => item.done).length;

  const completionPercent = Math.round(
    (completeCount / completionItems.length) * 100
  );

  return (
    <main className="page-shell">
      <nav className="nav">
        <Link className="logo" href={`/dashboard/${tradie.slug}`}>
          <span className="logo-mark">V</span>
          <span>Vekio</span>
        </Link>

        <div className="nav-links">
          <Link href={`/tradie/${tradie.slug}`}>View public profile</Link>
          <button type="button" onClick={async () => { await supabase.auth.signOut(); window.location.replace("/login"); }} style={{background:"none", border:0, padding:0, color:"inherit", cursor:"pointer", font:"inherit"}}>Logout</button>
        </div>
      </nav>

      <section className="tradie-v3">
        <section className="tradie-v3-hero card">
          <div className="hero-glow" />

          <div
            className="tradie-v3-avatar"
            style={{
              padding: 0,
              overflow: "hidden",
              flexShrink: 0,
            }}
          >
            {tradie.profile_photo_url ? (
              <img
                src={tradie.profile_photo_url}
                alt={`${fullName} profile`}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                }}
              />
            ) : (
              initials
            )}
          </div>

          <div className="tradie-v3-hero-copy">
            <div className="verified-pill">
              <BadgeCheck size={16} />
              Dashboard
            </div>

            <h1>Welcome, {firstName}</h1>

            <p>
              Manage your Vekio ID for <strong>{businessName}</strong>.
            </p>

            <div className="v3-badges">
              <span>
                <UserRound size={16} /> {fullName}
              </span>

              <span>
                <ClipboardCheck size={16} /> {trade}
              </span>

              <span>
                <Phone size={16} /> {tradie.phone || "Phone missing"}
              </span>

              <span>
                <Mail size={16} /> {tradie.email || "Email missing"}
              </span>
            </div>
          </div>

          <div className="v3-share-card">
            <strong>Profile {completionPercent}% complete</strong>
            <span>Finish your profile to build stronger trust.</span>
          </div>
        </section>

        <section className="tradie-v3-grid">
          <aside className="v3-enquiry card">
            <div className="eyebrow">Profile completion</div>

            <h2>{completionPercent}% complete</h2>

            <p>
              Complete the trust layer before sharing your profile widely.
            </p>

            <div style={{ marginTop: 18 }}>
              <div
                style={{
                  height: 12,
                  borderRadius: 999,
                  background: "rgba(255,255,255,.08)",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${completionPercent}%`,
                    height: "100%",
                    background:
                      "linear-gradient(90deg, var(--brand), var(--brand-2))",
                  }}
                />
              </div>
            </div>

            <div className="v3-list" style={{ marginTop: 22 }}>
              {completionItems.map((item) => (
                <span key={item.label}>
                  <ShieldCheck size={18} />
                  {item.done ? "✅" : "⬜"} {item.label}
                </span>
              ))}
            </div>

            <Link
              className="btn btn-primary btn-wide"
              href={`/tradie/${tradie.slug}`}
              style={{ marginTop: 22 }}
            >
              <Link2 size={18} />
              Preview public profile
            </Link>
          </aside>

          <section className="v3-content">
            <div className="v3-proof-strip">
              <div className="card proof-stat">
                <strong>{newEnquiries}</strong>
                <span>New enquiries</span>
              </div>

              <div className="card proof-stat">
                <strong>{[tradie.trade_licence_path, tradie.insurance_path].filter(Boolean).length}</strong>
                <span>Documents uploaded</span>
              </div>

              <div className="card proof-stat">
                <strong>1</strong>
                <span>Public profile live</span>
              </div>
            </div>

            <div className="card print-vekio-launch">
              <div>
                <div className="eyebrow">Print.Vekio</div>
                <h2>Turn your Vekio ID into printed marketing</h2>
                <p>Your business details are already here. Pick a product, customise the design and create production artwork.</p>
              </div>
              <Link className="btn btn-primary" href={`/print/${tradie.slug}/fridge-magnets`}>
                <Printer size={18} /> Design fridge magnets
              </Link>
            </div>

            <div className="card v3-about">
              <div style={{display:"flex",justifyContent:"space-between",gap:16,alignItems:"flex-start",flexWrap:"wrap"}}>
                <div>
                  <h2>Business details</h2>
                  <p>
                    <strong>Business:</strong> {businessName}
                    <br />
                    <strong>Owner:</strong> {fullName}
                    <br />
                    <strong>Trade:</strong> {trade}
                    <br />
                    <strong>Phone:</strong> {tradie.phone || "Not added"}
                    <br />
                    <strong>Email:</strong> {tradie.email || "Not added"}
                    <br />
                    <strong>Service area:</strong> {tradie.service_area || "Not added"}
                  </p>
                  {tradie.about_business && <p>{tradie.about_business}</p>}
                </div>
                <button type="button" className="btn btn-secondary" onClick={()=>setProfileEditOpen(!profileEditOpen)}>
                  {profileEditOpen ? "Close editor" : "Edit public details"}
                </button>
              </div>

              {profileEditOpen && (
                <div style={{marginTop:20,display:"grid",gap:14}}>
                  <label className="field">
                    <span>Service area</span>
                    <input value={serviceArea} onChange={(e)=>setServiceArea(e.target.value)} placeholder="Brabham, Ellenbrook, Midland, Perth Metro" />
                  </label>
                  <label className="field">
                    <span>About my business</span>
                    <textarea value={aboutBusiness} onChange={(e)=>setAboutBusiness(e.target.value)} placeholder="Tell customers what you do, what you specialise in, and what areas you service." />
                  </label>
                  <div>
                    <button type="button" className="btn btn-primary" disabled={profileSaving} onClick={savePublicDetails}>
                      {profileSaving ? "Saving..." : "Save public details"}
                    </button>
                  </div>
                </div>
              )}
              {profileSaveStatus && <p style={{marginTop:12,color:"#9effca"}}>{profileSaveStatus}</p>}
            </div>

            <div className="v3-two">
              <div className="card">
                <h2>Trust documents</h2>

                <div className="credential">
                  <FileCheck2 size={18} />
                  <div style={{flex:1}}>
                    <strong>Trade licence</strong>
                    <span>{tradie.trade_licence_path ? "Uploaded" : "Upload required"}</span>
                    <input ref={licenceInputRef} type="file" accept="application/pdf,image/jpeg,image/png,image/webp" onChange={(e)=>handleDocumentUpload(e,"licence")} style={{display:"none"}} />
                    <button type="button" className="btn btn-secondary" style={{marginTop:10}} disabled={assetUploading==="licence"} onClick={()=>licenceInputRef.current?.click()}>{assetUploading==="licence" ? "Uploading..." : tradie.trade_licence_path ? "Replace licence" : "Upload licence"}</button>
                  </div>
                </div>

                <div className="credential">
                  <ShieldCheck size={18} />
                  <div style={{flex:1}}>
                    <strong>Insurance</strong>
                    <span>{tradie.insurance_path ? "Uploaded" : "Upload required"}</span>
                    <input ref={insuranceInputRef} type="file" accept="application/pdf,image/jpeg,image/png,image/webp" onChange={(e)=>handleDocumentUpload(e,"insurance")} style={{display:"none"}} />
                    <button type="button" className="btn btn-secondary" style={{marginTop:10}} disabled={assetUploading==="insurance"} onClick={()=>insuranceInputRef.current?.click()}>{assetUploading==="insurance" ? "Uploading..." : tradie.insurance_path ? "Replace insurance" : "Upload insurance"}</button>
                  </div>
                </div>

                <div className="credential">
                  <BadgeCheck size={18} />
                  <div>
                    <strong>ABN</strong>
                    <span>Verification pending</span>
                  </div>
                </div>
              </div>

              <div className="card">
                <h2>Profile assets</h2>

                <div className="credential profile-photo-credential">
                  <ImagePlus size={18} />

                  <div style={{ flex: 1 }}>
                    <strong>Profile photo / logo</strong>

                    <span>
                      {tradie.profile_photo_url
                        ? "Uploaded — used across Vekio and Print.Vekio"
                        : "Not uploaded"}
                    </span>

                    <input
                      ref={photoInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleProfilePhotoUpload}
                      style={{ display: "none" }}
                    />

                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={chooseProfilePhoto}
                      disabled={photoUploading}
                      style={{ marginTop: 12 }}
                    >
                      <ImagePlus size={17} />
                      {photoUploading
                        ? "Uploading..."
                        : tradie.profile_photo_url
                        ? "Replace image"
                        : "Upload image"}
                    </button>

                    {photoStatus && (
                      <span style={{ marginTop: 10, display: "block" }}>
                        {photoStatus}
                      </span>
                    )}
                  </div>
                </div>

                <div className="credential">
                  <ImagePlus size={18} />
                  <div style={{flex:1}}>
                    <strong>Project gallery</strong>
                    <span>{tradie.project_photo_urls?.length ? `${tradie.project_photo_urls.length} photo${tradie.project_photo_urls.length===1?"":"s"} uploaded` : "Add proof of work"}</span>
                    <input ref={projectInputRef} type="file" accept="image/*" onChange={handleProjectPhotoUpload} style={{display:"none"}} />
                    <button type="button" className="btn btn-secondary" style={{marginTop:10}} disabled={assetUploading==="project"} onClick={()=>projectInputRef.current?.click()}>{assetUploading==="project" ? "Uploading..." : "Add project photo"}</button>
                    {tradie.project_photo_urls?.length ? <div className="dashboard-project-thumbs">{tradie.project_photo_urls.slice(-4).map((url,i)=><img key={`${url}-${i}`} src={url} alt="Project work" />)}</div> : null}
                  </div>
                </div>

                <div className="credential">
                  <Star size={18} />

                  <div>
                    <strong>Reviews</strong>
                    <span>No reviews yet</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <h2>Next actions</h2>

              <div className="v3-list">
                {!tradie.profile_photo_url && (
                  <button
                    type="button"
                    onClick={chooseProfilePhoto}
                    disabled={photoUploading}
                    style={{
                      width: "100%",
                      border: 0,
                      background: "transparent",
                      color: "inherit",
                      padding: 0,
                      font: "inherit",
                      textAlign: "left",
                      cursor: photoUploading ? "wait" : "pointer",
                    }}
                  >
                    <span>
                      <ImagePlus size={18} />
                      {photoUploading ? "Uploading profile image..." : "Upload profile photo / logo"}
                    </span>
                  </button>
                )}

                {!tradie.trade_licence_path && <button type="button" className="next-action-button" onClick={()=>licenceInputRef.current?.click()}><span><FileCheck2 size={18}/> Upload trade licence</span></button>}
                {!tradie.insurance_path && <button type="button" className="next-action-button" onClick={()=>insuranceInputRef.current?.click()}><span><ShieldCheck size={18}/> Upload insurance certificate</span></button>}
                {!tradie.project_photo_urls?.length && <button type="button" className="next-action-button" onClick={()=>projectInputRef.current?.click()}><span><ImagePlus size={18}/> Add first project photo</span></button>}

                <span>
                  <Link2 size={18} /> Copy and share public Vekio link
                </span>
              </div>
              {assetStatus && <p style={{marginTop:14,color:"#9effca"}}>{assetStatus}</p>}
            </div>
          </section>
        </section>
      </section>
    </main>
  );
}