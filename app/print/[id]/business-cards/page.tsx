"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft, Check, CreditCard, Download, Image as ImageIcon, Palette, RotateCcw } from "lucide-react";
import { supabase } from "../../../../lib/supabase";

type Tradie = {
  id:string;
  full_name:string|null;
  business_name:string|null;
  trade:string|null;
  phone:string|null;
  email:string|null;
  slug:string|null;
  profile_photo_url:string|null;
  service_area:string|null;
};
type Layout="split"|"minimal"|"qr";

const palettes=[
  {name:"Vekio Blue",bg:"#071b31",accent:"#70f0ff",ink:"#ffffff",soft:"#d7f7ff"},
  {name:"Electric",bg:"#101318",accent:"#ffd84d",ink:"#ffffff",soft:"#f4f4f4"},
  {name:"Clean",bg:"#f5f7fa",accent:"#1565c0",ink:"#101828",soft:"#475467"},
  {name:"Trade Red",bg:"#241014",accent:"#ff665e",ink:"#ffffff",soft:"#ffe1df"},
];

function esc(v:string){return v.replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&apos;"}[c]||c));}

export default function BusinessCardDesigner(){
  const {id}=useParams<{id:string}>();
  const [tradie,setTradie]=useState<Tradie|null>(null);
  const [loading,setLoading]=useState(true);
  const [business,setBusiness]=useState("");
  const [person,setPerson]=useState("");
  const [trade,setTrade]=useState("");
  const [phone,setPhone]=useState("");
  const [email,setEmail]=useState("");
  const [serviceArea,setServiceArea]=useState("");
  const [cta,setCta]=useState("Scan to view my Vekio profile");
  const [layout,setLayout]=useState<Layout>("split");
  const [palette,setPalette]=useState(0);
  const [showImage,setShowImage]=useState(true);
  const [generating,setGenerating]=useState(false);

  useEffect(()=>{(async()=>{
    const {data}=await supabase.from("tradies").select("id,full_name,business_name,trade,phone,email,slug,profile_photo_url,service_area").eq("slug",id).single();
    if(data){setTradie(data);setBusiness(data.business_name||data.full_name||"My Business");setPerson(data.full_name||"");setTrade(data.trade||"Local trade professional");setPhone(data.phone||"");setEmail(data.email||"");setServiceArea(data.service_area||"");}
    setLoading(false);
  })()},[id]);

  const p=palettes[palette];
  const profileUrl=useMemo(()=>`https://www.vekio.com.au/tradie/${tradie?.slug||id}`,[tradie,id]);
  const qrUrl=useMemo(()=>`https://api.qrserver.com/v1/create-qr-code/?size=420x420&margin=8&data=${encodeURIComponent(profileUrl)}`,[profileUrl]);

  function reset(){if(!tradie)return;setBusiness(tradie.business_name||tradie.full_name||"My Business");setPerson(tradie.full_name||"");setTrade(tradie.trade||"Local trade professional");setPhone(tradie.phone||"");setEmail(tradie.email||"");setServiceArea(tradie.service_area||"");setCta("Scan to view my Vekio profile");setLayout("split");setPalette(0);setShowImage(true);}

  async function asDataUrl(url:string){try{const res=await fetch(url);if(!res.ok)return"";const blob=await res.blob();return await new Promise<string>(resolve=>{const r=new FileReader();r.onload=()=>resolve(String(r.result||""));r.onerror=()=>resolve("");r.readAsDataURL(blob);});}catch{return"";}}

  function saveSvg(svg:string,name:string){const blob=new Blob([svg],{type:"image/svg+xml"});const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);}

  async function downloadArtwork(){
    setGenerating(true);
    try{
      const W=1063,H=650;
      const [qrData,photoData]=await Promise.all([asDataUrl(qrUrl),showImage&&tradie?.profile_photo_url?asDataUrl(tradie.profile_photo_url):Promise.resolve("")]);
      if(!qrData){alert("The QR code could not be generated. Please try again.");return;}
      const base=(business||"vekio").replace(/[^a-z0-9]+/gi,"-").replace(/^-|-$/g,"").toLowerCase();
      const photo=photoData?`<defs><clipPath id="pc"><rect x="70" y="315" width="150" height="150" rx="26"/></clipPath></defs><image href="${photoData}" x="70" y="315" width="150" height="150" preserveAspectRatio="xMidYMid slice" clip-path="url(#pc)"/><rect x="70" y="315" width="150" height="150" rx="26" fill="none" stroke="${p.accent}" stroke-width="3"/>`:"";
      const copyX=photoData?250:70;
      const front=`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><rect width="${W}" height="${H}" fill="${p.bg}"/><rect x="34" y="34" width="995" height="582" rx="18" fill="none" stroke="${p.accent}" stroke-width="3" opacity=".45"/><text x="70" y="125" fill="${p.accent}" font-family="Arial,sans-serif" font-size="25" font-weight="700" letter-spacing="2">VEKIO PROFESSIONAL</text><text x="70" y="225" fill="${p.ink}" font-family="Arial,sans-serif" font-size="66" font-weight="800">${esc(business.slice(0,27))}</text><text x="70" y="285" fill="${p.soft}" font-family="Arial,sans-serif" font-size="30">${esc(trade.slice(0,44))}</text>${photo}<text x="${copyX}" y="390" fill="${p.ink}" font-family="Arial,sans-serif" font-size="31" font-weight="700">${esc(person.slice(0,32))}</text><text x="${copyX}" y="435" fill="${p.accent}" font-family="Arial,sans-serif" font-size="38" font-weight="800">${esc(phone||"YOUR PHONE")}</text><text x="70" y="535" fill="${p.soft}" font-family="Arial,sans-serif" font-size="20">${esc(serviceArea.slice(0,72))}</text></svg>`;
      const back=`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><rect width="${W}" height="${H}" fill="${p.bg}"/><rect x="34" y="34" width="995" height="582" rx="18" fill="none" stroke="${p.accent}" stroke-width="3" opacity=".45"/><text x="70" y="135" fill="${p.ink}" font-family="Arial,sans-serif" font-size="42" font-weight="800">Connect with ${esc((person||business).slice(0,27))}</text><text x="70" y="195" fill="${p.soft}" font-family="Arial,sans-serif" font-size="24">${esc(email.slice(0,50))}</text><text x="70" y="240" fill="${p.accent}" font-family="Arial,sans-serif" font-size="34" font-weight="800">${esc(phone||"YOUR PHONE")}</text><rect x="698" y="120" width="270" height="270" rx="22" fill="#fff"/><image href="${qrData}" x="714" y="136" width="238" height="238"/><text x="833" y="430" text-anchor="middle" fill="${p.ink}" font-family="Arial,sans-serif" font-size="18">${esc(cta.slice(0,38))}</text><text x="70" y="520" fill="${p.soft}" font-family="Arial,sans-serif" font-size="20">${esc(profileUrl)}</text><text x="70" y="565" fill="${p.accent}" font-family="Arial,sans-serif" font-size="20" font-weight="700">Powered by Vekio</text></svg>`;
      saveSvg(front,`${base}-business-card-front.svg`);
      setTimeout(()=>saveSvg(back,`${base}-business-card-back.svg`),250);
    }finally{setGenerating(false);}
  }

  if(loading)return <main className="page-shell print-loading">Loading Print.Vekio…</main>;
  if(!tradie)return <main className="page-shell print-loading">Vekio profile not found.</main>;

  return <main className="page-shell print-page">
    <nav className="nav"><Link className="logo" href={`/print/${id}`}><span className="logo-mark">V</span><span>Print.Vekio</span></Link><Link className="btn btn-secondary" href={`/print/${id}`}><ArrowLeft size={17}/> Products</Link></nav>
    <section className="print-head"><div><div className="eyebrow">Business cards · V1 designer</div><h1>Hand them your Vekio ID.</h1><p>Front for your business. Back for direct contact and your unique Vekio QR.</p></div><div className="print-status"><Check size={18}/> Vekio profile connected</div></section>
    <section className="print-workspace">
      <aside className="card print-controls">
        <div className="control-title"><CreditCard size={20}/><strong>Card details</strong></div>
        <label>Business name<input value={business} maxLength={27} onChange={e=>setBusiness(e.target.value)}/></label>
        <label>Contact person<input value={person} maxLength={32} onChange={e=>setPerson(e.target.value)}/></label>
        <label>Trade / tagline<input value={trade} maxLength={44} onChange={e=>setTrade(e.target.value)}/></label>
        <label>Phone<input value={phone} maxLength={24} onChange={e=>setPhone(e.target.value)}/></label>
        <label>Email<input value={email} maxLength={50} onChange={e=>setEmail(e.target.value)}/></label>
        <label>Service area<input value={serviceArea} maxLength={72} onChange={e=>setServiceArea(e.target.value)}/></label>
        <label>QR call-to-action<input value={cta} maxLength={38} onChange={e=>setCta(e.target.value)}/></label>
        {tradie.profile_photo_url&&<label className="print-image-toggle"><span><ImageIcon size={18}/><span><strong>Profile image</strong><small>Imported automatically from Vekio</small></span></span><input type="checkbox" checked={showImage} onChange={e=>setShowImage(e.target.checked)}/></label>}
        <div className="control-title"><Palette size={20}/><strong>Style</strong></div>
        <div className="layout-picks">{(["split","minimal","qr"] as Layout[]).map(x=><button key={x} className={layout===x?"active":""} onClick={()=>setLayout(x)}>{x==="qr"?"QR Focus":x[0].toUpperCase()+x.slice(1)}</button>)}</div>
        <div className="palette-picks">{palettes.map((x,i)=><button key={x.name} title={x.name} className={palette===i?"active":""} style={{background:x.bg,borderColor:x.accent}} onClick={()=>setPalette(i)}><span style={{background:x.accent}}/></button>)}</div>
        <button className="btn btn-secondary btn-wide" onClick={reset}><RotateCcw size={17}/> Reset from Vekio</button>
      </aside>

      <section className="print-stage business-card-stage">
        <div className="stage-label">LIVE PREVIEW · STANDARD 90 × 55 MM CONCEPT SIZE</div>
        <div className="business-card-pair">
          <div className={`business-card-preview bc-front bc-${layout}`} style={{background:p.bg,color:p.ink,borderColor:p.accent}}>
            <div className="bc-kicker" style={{color:p.accent}}>VEKIO PROFESSIONAL</div>
            <strong>{business||"YOUR BUSINESS"}</strong>
            <em>{trade||"Your trade"}</em>
            <div className="bc-front-lower">
              {showImage&&tradie.profile_photo_url&&<img src={tradie.profile_photo_url} alt="Profile"/>}
              <div><b>{person||"Contact person"}</b><span style={{color:p.accent}}>{phone||"YOUR PHONE"}</span></div>
            </div>
            <small>{serviceArea}</small>
          </div>
          <div className={`business-card-preview bc-back bc-${layout}`} style={{background:p.bg,color:p.ink,borderColor:p.accent}}>
            <div className="bc-back-copy"><strong>Connect with {person||business}</strong><span>{email}</span><b style={{color:p.accent}}>{phone}</b><small>{profileUrl}</small><em style={{color:p.accent}}>Powered by Vekio</em></div>
            <div className="bc-back-qr"><div className="qr-live"><img src={qrUrl} alt={`QR code for ${profileUrl}`}/></div><small>{cta}</small></div>
          </div>
        </div>
        <div className="production-note"><strong>Two-sided V1 artwork.</strong> The front and back are generated as separate SVG files at a 90 × 55 mm concept ratio. Final supplier bleed/crop requirements will be added when printer fulfilment is connected.</div>
        <div className="stage-actions"><button className="btn btn-primary" onClick={downloadArtwork} disabled={generating}><Download size={18}/> {generating?"Building artwork…":"Generate front + back SVGs"}</button><button className="btn btn-secondary" disabled title="Supplier fulfilment is the next integration">Send to print — next</button></div>
      </section>
    </section>
  </main>;
}
