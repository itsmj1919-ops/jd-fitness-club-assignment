/**
 * Monumental Athletics: an editorial journal that extends the gym’s point of view beyond the floor.
 */
import { ArrowUpRight } from "lucide-react";
import { Link } from "wouter";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";

const recoveryImage = "/manus-storage/atlas-recovery-suite_21ce41e6.jpg";
const notes = [
  ["Practice", "Why the most useful plan is the one you will repeat."],
  ["Recovery", "A quieter way to think about the days between sessions."],
  ["Coaching", "How a simple question can change the shape of a training week."],
];

export default function Journal() { return <div className="site-shell page-light"><SiteHeader /><main><section className="journal-hero"><p className="eyebrow">The Atlas Journal</p><h1>Notes from<br />inside the practice.</h1><p>Thoughtful writing about strength, recovery, and making a little more room for yourself.</p></section><section className="journal-feature"><img src={recoveryImage} alt="Quiet private recovery suite with limestone walls and warm lighting" /><div><p className="eyebrow">Featured note / Recovery</p><h2>Rest is not the absence of work. It is part of the work.</h2><p>A short reflection on designing a week that leaves enough capacity for the people and projects outside the gym.</p><button onClick={() => alert("This demonstration journal opens article content in the completed member experience.")}>Read the note <ArrowUpRight size={16} /></button></div></section><section className="journal-list">{notes.map(([type, title], index) => <article key={title}><span>0{index + 1}</span><p>{type}</p><h2>{title}</h2><button onClick={() => alert("This demonstration journal opens article content in the completed member experience.")} aria-label={`Read ${title}`}><ArrowUpRight size={18} /></button></article>)}</section></main><SiteFooter /></div>; }
