"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft, Check, Download, Magnet, Palette, QrCode, RotateCcw } from "lucide-react";
import { supabase } from "../../../../lib/supabase";

type Tradie = { id:string; full_name:string|null; business_name:string|null; trade:string|null; phone:string|null; email:string|null; slug:string|null; profile_photo_url:string|null };
type Layout = "bold" | "clean" | "qr";

const palettes = [
  { name:"Vekio Blue", bg:"#071b31", accent:"#70f0ff", ink:"#ffffff" },
  { name:"Electric", bg:"#101318", accent:"#ffd84d", ink:"#ffffff" },
  { name:"Clean", bg:"#f5f7fa", accent:"#1565c0", ink:"#101828" },
  { name:"Trade Red", bg:"#241014", accent:"#ff665e", ink:"#ffffff" },
];

function esc(v:string){return v.replace(/[&<>"']/g, c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&apos;"}[c]||c));}

export default function FridgeMagnetDesigner(){
  const { id } = useParams<{id:string}>();
  const [tradie,setTradie]=useState<Tradie|null>(null);
  const [loading,setLoading]=useState(true);
  const [business,setBusiness]=useState("");
  const [tagline,setTagline]=useState("");
  const [phone,setPhone]=useState("");
  const [cta,setCta]=useState("Scan to view my Vekio profile");
  const [layout,setLayout]=useState<Layout>("bold");
  const [palette,setPalette]=useState(0);

  useEffect(()=>{(async()=>{
    const {data}=await supabase.from("tradies").select("id,full_name,business_name,trade,phone,email,slug,profile_photo_url").eq("slug",id).single();
    if(data){ setTradie(data); setBusiness(data.business_name||data.full_name||"My Business"); setTagline(data.trade||"Local trade professional"); setPhone(data.phone||""); }
    setLoading(false);
  })()},[id]);

  const p=palettes[palette];
  const profileUrl=useMemo(()=>`https://vekio.com.au/tradie/${tradie?.slug||id}`,[tradie,id]);

  function reset(){ if(!tradie)return; setBusiness(tradie.business_name||tradie.full_name||"My Business"); setTagline(tradie.trade||"Local trade professional"); setPhone(tradie.phone||""); setCta("Scan to view my Vekio profile"); setLayout("bold"); setPalette(0); }

  function downloadArtwork(){
    const W=1063,H=650; // 90x55mm at ~300dpi
    const qrX=layout==="qr"?710:760, qrY=layout==="qr"?145:330, qrS=layout==="qr"?230:170;
    const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
      <rect width="1063" height="650" rx="18" fill="${p.bg}"/>
      <rect x="34" y="34" width="995" height="582" rx="12" fill="none" stroke="${p.accent}" stroke-width="3" opacity=".5"/>
      <text x="70" y="150" fill="${p.accent}" font-family="Arial,sans-serif" font-size="28" font-weight="700">VEKIO VERIFIED PROFESSIONAL</text>
      <text x="70" y="235" fill="${p.ink}" font-family="Arial,sans-serif" font-size="${layout==='clean'?54:64}" font-weight="800">${esc(business.slice(0,28))}</text>
      <text x="70" y="295" fill="${p.ink}" opacity=".78" font-family="Arial,sans-serif" font-size="30">${esc(tagline.slice(0,46))}</text>
      <text x="70" y="430" fill="${p.accent}" font-family="Arial,sans-serif" font-size="42" font-weight="800">${esc(phone||"YOUR PHONE")}</text>
      <text x="70" y="490" fill="${p.ink}" opacity=".72" font-family="Arial,sans-serif" font-size="22">${esc(profileUrl)}</text>
      <rect x="${qrX}" y="${qrY}" width="${qrS}" height="${qrS}" rx="16" fill="#fff"/>
      <text x="${qrX+qrS/2}" y="${qrY+qrS/2-5}" text-anchor="middle" fill="#111" font-family="Arial,sans-serif" font-size="28" font-weight="800">QR</text>
      <text x="${qrX+qrS/2}" y="${qrY+qrS/2+30}" text-anchor="middle" fill="#555" font-family="Arial,sans-serif" font-size="15">production placeholder</text>
      <text x="${qrX+qrS/2}" y="${qrY+qrS+38}" text-anchor="middle" fill="${p.ink}" font-family="Arial,sans-serif" font-size="16">${esc(cta.slice(0,34))}</text>
    </svg>`;
    const blob=new Blob([svg],{type:"image/svg+xml"}); const a=document.createElement("a"); a.href=URL.createObjectURL(blob); a.download=`${(business||"vekio").replace(/[^a-z0-9]+/gi,"-").toLowerCase()}-fridge-magnet.svg`; a.click(); URL.revokeObjectURL(a.href);
  }

  if(loading) return <main className="page-shell print-loading">Loading Print.Vekio…</main>;
  if(!tradie) return <main className="page-shell print-loading">Vekio profile not found.</main>;

  return <main className="page-shell print-page">
    <nav className="nav"><Link className="logo" href="/"><span className="logo-mark">V</span><span>Print.Vekio</span></Link><Link className="btn btn-secondary" href={`/dashboard/${id}`}><ArrowLeft size={17}/> Dashboard</Link></nav>
    <section className="print-head"><div><div className="eyebrow">Fridge magnets · V1 designer</div><h1>Make the fridge earn its keep.</h1><p>Vekio has pre-filled your business. Customise the essentials, approve the design, then generate artwork.</p></div><div className="print-status"><Check size={18}/> Vekio profile connected</div></section>
    <section className="print-workspace">
      <aside className="card print-controls">
        <div className="control-title"><Magnet size={20}/><strong>Magnet details</strong></div>
        <label>Business name<input value={business} maxLength={28} onChange={e=>setBusiness(e.target.value)}/></label>
        <label>Trade / tagline<input value={tagline} maxLength={46} onChange={e=>setTagline(e.target.value)}/></label>
        <label>Phone<input value={phone} maxLength={24} onChange={e=>setPhone(e.target.value)}/></label>
        <label>QR call-to-action<input value={cta} maxLength={34} onChange={e=>setCta(e.target.value)}/></label>
        <div className="control-title"><Palette size={20}/><strong>Style</strong></div>
        <div className="layout-picks">{(["bold","clean","qr"] as Layout[]).map(x=><button key={x} className={layout===x?"active":""} onClick={()=>setLayout(x)}>{x==='qr'?"QR Hero":x[0].toUpperCase()+x.slice(1)}</button>)}</div>
        <div className="palette-picks">{palettes.map((x,i)=><button key={x.name} title={x.name} className={palette===i?"active":""} style={{background:x.bg,borderColor:x.accent}} onClick={()=>setPalette(i)}><span style={{background:x.accent}}/></button>)}</div>
        <button className="btn btn-secondary btn-wide" onClick={reset}><RotateCcw size={17}/> Reset from Vekio</button>
      </aside>
      <section className="print-stage">
        <div className="stage-label">LIVE PREVIEW · 90 × 55 MM CONCEPT SIZE</div>
        <div className={`magnet-preview layout-${layout}`} style={{background:p.bg,color:p.ink,borderColor:p.accent}}>
          <div className="magnet-copy"><span className="magnet-kicker" style={{color:p.accent}}>VEKIO VERIFIED PROFESSIONAL</span><strong>{business||"YOUR BUSINESS"}</strong><em>{tagline||"Your trade"}</em><b style={{color:p.accent}}>{phone||"YOUR PHONE"}</b><small>{profileUrl}</small></div>
          <div className="magnet-qr"><div className="qr-placeholder"><QrCode size={layout==="qr"?92:70}/><span>QR</span></div><small>{cta}</small></div>
        </div>
        <div className="production-note"><strong>V1 artwork engine is live.</strong> The QR square is deliberately marked as a production placeholder until we wire in a real QR encoder; it will not be sent to print as-is.</div>
        <div className="stage-actions"><button className="btn btn-primary" onClick={downloadArtwork}><Download size={18}/> Generate SVG artwork</button><button className="btn btn-secondary" disabled title="Supplier fulfilment is the next integration">Send to print — next</button></div>
      </section>
    </section>
  </main>
}
