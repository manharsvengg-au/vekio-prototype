"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft, Check, CreditCard, FileText, Magnet, Printer, Sparkles } from "lucide-react";
import { supabase } from "../../../lib/supabase";

type Tradie = {
  id:string;
  full_name:string|null;
  business_name:string|null;
  trade:string|null;
  slug:string|null;
  profile_photo_url:string|null;
};

export default function PrintVekioHub(){
  const { id } = useParams<{id:string}>();
  const [tradie,setTradie]=useState<Tradie|null>(null);
  const [loading,setLoading]=useState(true);

  useEffect(()=>{(async()=>{
    const {data}=await supabase.from("tradies").select("id,full_name,business_name,trade,slug,profile_photo_url").eq("slug",id).single();
    setTradie(data||null);
    setLoading(false);
  })()},[id]);

  if(loading) return <main className="page-shell print-loading">Loading Print.Vekio…</main>;
  if(!tradie) return <main className="page-shell print-loading">Vekio profile not found.</main>;

  const name=tradie.business_name||tradie.full_name||"Your business";

  return <main className="page-shell print-page">
    <nav className="nav">
      <Link className="logo" href={`/print/${id}`}><span className="logo-mark">V</span><span>Print.Vekio</span></Link>
      <Link className="btn btn-secondary" href={`/dashboard/${id}`}><ArrowLeft size={17}/> Dashboard</Link>
    </nav>

    <section className="print-head print-hub-head">
      <div>
        <div className="eyebrow">Print.Vekio · Product hub</div>
        <h1>Your Vekio ID, in the real world.</h1>
        <p>{name} is already connected. Pick a product and Print.Vekio will reuse your business details, profile image and unique Vekio QR.</p>
      </div>
      <div className="print-status"><Check size={18}/> Vekio profile connected</div>
    </section>

    <section className="print-product-grid">
      <Link className="card print-product-card live" href={`/print/${id}/fridge-magnets`}>
        <div className="print-product-icon"><Magnet size={30}/></div>
        <div className="print-product-state">LIVE</div>
        <h2>Fridge magnets</h2>
        <p>Stay visible where customers actually look. Personalised QR, profile image and phone number included.</p>
        <span className="print-product-cta">Design fridge magnets →</span>
      </Link>

      <Link className="card print-product-card live" href={`/print/${id}/business-cards`}>
        <div className="print-product-icon"><CreditCard size={30}/></div>
        <div className="print-product-state">NEW</div>
        <h2>Business cards</h2>
        <p>Single-sided cards generated from your Vekio identity, with contact details and your scannable Vekio QR.</p>
        <span className="print-product-cta">Design business cards →</span>
      </Link>

      <Link className="card print-product-card live" href={`/print/${id}/flyers`}>
        <div className="print-product-icon"><FileText size={30}/></div>
        <div className="print-product-state">NEW</div>
        <h2>Flyers</h2>
        <p>A5 promotional flyers generated from the same business identity, contact details and Vekio QR.</p>
        <span className="print-product-cta">Design flyers →</span>
      </Link>
    </section>

    <section className="print-hub-note card">
      <Printer size={22}/>
      <div><strong>One identity. Many print products.</strong><p>Update your Vekio profile once and future Print.Vekio products can pull the same core business information automatically.</p></div>
    </section>
  </main>;
}
