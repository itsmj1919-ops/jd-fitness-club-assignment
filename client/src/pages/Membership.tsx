/**
 * Monumental Athletics: membership is presented as a hospitable invitation with direct, useful detail.
 */
import { Check, ArrowUpRight } from "lucide-react";
import { Link } from "wouter";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";

const loungeImage = "/manus-storage/atlas-members-lounge_9f1a5b18.jpg";
const tiers = [
  { name: "House", price: "$140", note: "For a steady rhythm.", features: ["Four coached floor sessions", "Member class booking", "Training baseline"] },
  { name: "Practice", price: "$195", note: "For an integrated week.", features: ["Eight coached floor sessions", "All group classes", "Monthly coaching review"], featured: true },
  { name: "Atlas", price: "$260", note: "For a complete system.", features: ["Unlimited floor sessions", "Priority class booking", "Recovery room access"] },
];

export default function Membership() { return <div className="site-shell page-light"><SiteHeader /><main><section className="membership-intro"><div><p className="eyebrow">Membership</p><h1>Enough structure<br />to return.</h1><p>Membership is a way of making room for a practice. Choose the cadence that your actual life can hold.</p></div><img src={loungeImage} alt="Members lounge with oak seating and daylight" /></section><section className="membership-folio">{tiers.map((tier, index) => <article className={tier.featured ? "featured" : ""} key={tier.name}><span className="folio-index">0{index + 1}</span><div>{tier.featured && <small>Most chosen</small>}<h2>{tier.name}</h2><p className="folio-note">{tier.note}</p></div><div className="folio-terms"><strong>{tier.price}<span>/ month</span></strong><ul>{tier.features.map((feature) => <li key={feature}><Check size={15} />{feature}</li>)}</ul><Link href="/visit">Ask about {tier.name} <ArrowUpRight size={16} /></Link></div></article>)}</section><section className="membership-note"><p className="eyebrow">A simple beginning</p><h2>We start with a visit, a conversation, and a plan.</h2><Link href="/visit" className="dark-button">Plan a visit <ArrowUpRight size={17} /></Link></section></main><SiteFooter /></div>; }
