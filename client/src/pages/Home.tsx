/**
 * Monumental Athletics: lead with a real, cinematic sense of place before introducing the complete training system.
 */
import { ArrowUpRight, MapPin, MoveRight } from "lucide-react";
import { Link } from "wouter";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";
import { WorldHero } from "@/components/WorldHero";

const coachImage = "/manus-storage/atlas-coach-strength_66690ece.jpg";
const loungeImage = "/manus-storage/atlas-members-lounge_9f1a5b18.jpg";
const recoveryImage = "/manus-storage/atlas-recovery-suite_21ce41e6.jpg";

const pillars = [
  ["01", "Strength", "The patient work of getting stronger, with a plan that respects where you are."],
  ["02", "Capacity", "Conditioning that makes the rest of your week feel more possible."],
  ["03", "Restore", "Movement, recovery, and attention to the habits that keep the work repeatable."],
];

export default function Home() {
  return <div className="site-shell"><SiteHeader overlay /><main><WorldHero /><section id="entry" className="entry-statement"><p className="eyebrow">Performance Atlas / Est. 2026</p><div><h2>Training is not a transaction. It is a practice.</h2><p>We built a calm, exacting place for people who want to do meaningful work and do it for a long time.</p></div></section><section className="pillar-grid">{pillars.map(([number, title, copy]) => <article key={title}><span>{number}</span><h3>{title}</h3><p>{copy}</p><Link href="/programs">Explore the program <ArrowUpRight size={16} /></Link></article>)}</section><section className="editorial-split"><div className="editorial-image"><img src={coachImage} alt="A strength coach guiding a member in the training hall" /></div><div className="editorial-copy"><p className="eyebrow">Coaching, without theatre</p><h2>Guidance that meets the moment.</h2><p>Every member begins with a conversation, a baseline, and a coaching relationship built around the life outside the gym as much as the hour inside it.</p><Link href="/coaches" className="text-link">Meet the coaching team <MoveRight size={17} /></Link></div></section><section className="image-tiles"><article className="large-tile"><img src={loungeImage} alt="Quiet members lounge beside the training hall" /><div><p className="eyebrow-light">Membership</p><h3>Space to do the work.</h3><Link href="/membership">See membership <ArrowUpRight size={18} /></Link></div></article><article className="small-tile"><img src={recoveryImage} alt="Private recovery suite with limestone and timber finishes" /><div><p className="eyebrow-light">The journal</p><h3>Notes on training well.</h3><Link href="/journal">Read the journal <ArrowUpRight size={18} /></Link></div></article></section><section className="visit-band"><MapPin size={24} /><p>Find us under the viaduct, where daylight reaches the floor.</p><Link href="/visit">Plan a visit <ArrowUpRight size={18} /></Link></section></main><SiteFooter /></div>;
}
