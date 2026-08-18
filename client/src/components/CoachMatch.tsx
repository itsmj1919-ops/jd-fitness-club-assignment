/**
 * Monumental Athletics: a lightweight, accessible match prompt that directs the visitor to an appropriate coaching introduction.
 */
import { ArrowUpRight, Sparkles } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";

const matches = {
  stronger: { name: "Maya Laurent", specialty: "Strength & movement", copy: "Maya begins with clear positions and a plan you can keep returning to." },
  steadier: { name: "Jules Rowan", specialty: "Capacity & field work", copy: "Jules builds durable conditioning around the rest of your actual week." },
  returning: { name: "Noor Shah", specialty: "Mobility & recovery", copy: "Noor creates a calm, practical way back into range, confidence, and rhythm." },
};

export function CoachMatch() {
  const [selection, setSelection] = useState<keyof typeof matches>("stronger");
  const match = matches[selection];
  return <section className="coach-match" aria-labelledby="coach-match-title"><div><p className="eyebrow"><Sparkles size={13} /> Find a starting point</p><h2 id="coach-match-title">What would make training feel more useful?</h2><div className="match-choices" role="group" aria-label="Choose your coaching priority"><button className={selection === "stronger" ? "active" : ""} onClick={() => setSelection("stronger")}>I want to get stronger</button><button className={selection === "steadier" ? "active" : ""} onClick={() => setSelection("steadier")}>I want more steady energy</button><button className={selection === "returning" ? "active" : ""} onClick={() => setSelection("returning")}>I am returning to movement</button></div></div><article className="match-result"><span>Suggested introduction</span><h3>{match.name}</h3><p>{match.specialty}</p><small>{match.copy}</small><Link href="/visit">Arrange an introduction <ArrowUpRight size={17} /></Link></article></section>;
}
