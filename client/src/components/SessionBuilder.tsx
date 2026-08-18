/**
 * Monumental Athletics: a client-side planning tool that adds value without presenting fictional member data as real.
 */
import { ArrowUpRight, CheckCircle2, Clock3, Sparkles } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";

const focuses = {
  Strength: { lead: "Three rooms. One reliable week.", note: "A steady rhythm for building strength without making the rest of your week smaller.", days: [["Monday", "Strength floor", "Lower body, carries, and a simple finish."], ["Wednesday", "Restore room", "Range, breath, and room to recover."], ["Saturday", "Strength floor", "Upper body, trunk, and intentional loading."]] },
  Capacity: { lead: "An engine with a little more space.", note: "A clear pattern of effort and recovery that does not ask you to live at the edge.", days: [["Tuesday", "Capacity lane", "Sled work, intervals, and an easy return down."], ["Thursday", "Restore room", "Movement quality and a quieter nervous system."], ["Sunday", "Capacity lane", "Longer aerobic work and a light carry."]] },
  Restore: { lead: "Make continuity the outcome.", note: "A gentle route back into the work, focused on range, confidence, and recurring attention.", days: [["Monday", "Restore room", "Mobility, breath, and a deliberate baseline."], ["Friday", "Strength floor", "Simple positions, light loading, and confidence."], ["Sunday", "Restore room", "A longer reset before the week begins."]] },
};

export function SessionBuilder() {
  const [focus, setFocus] = useState<keyof typeof focuses>("Strength");
  const plan = focuses[focus];
  return <section className="session-builder" aria-labelledby="session-builder-title"><div className="session-builder-head"><p className="eyebrow"><Sparkles size={13} /> The session builder</p><h2 id="session-builder-title">A week that leaves room for the rest of your life.</h2><p>This is an example rhythm, not a prescription. A coach helps you make it yours when you visit.</p><div className="segment-control" role="group" aria-label="Choose a training focus">{(Object.keys(focuses) as Array<keyof typeof focuses>).map((item) => <button key={item} aria-pressed={focus === item} onClick={() => setFocus(item)}>{item}</button>)}</div></div><div className="session-plan"><div className="session-plan-intro"><span>ATLAS / {focus.toUpperCase()}</span><h3>{plan.lead}</h3><p>{plan.note}</p></div><div className="session-days">{plan.days.map(([day, room, details], index) => <article key={day}><span>0{index + 1}</span><div><p>{day} <Clock3 size={13} /></p><h4>{room}</h4><small>{details}</small></div><CheckCircle2 size={17} /></article>)}</div><Link href="/visit" className="session-cta">Build this with a coach <ArrowUpRight size={17} /></Link></div></section>;
}
