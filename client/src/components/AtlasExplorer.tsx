/**
 * JD Fitness Club: a structured, focus-safe image discovery component inspired by premium interactive-list patterns.
 */
import { ArrowUpRight, Compass, MoveRight } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";

const zones = [
  { id: "strength", number: "01", title: "The strength room", label: "Barbell, balance, long effort", copy: "Blackened steel, clear positions, and incremental work that builds a body you can use.", image: "/manus-storage/atlas-zone-strength_c0b9b801.jpg", route: "/programs" },
  { id: "capacity", number: "02", title: "The capacity lane", label: "Carry, push, recover", copy: "A long open lane for steady conditioning, sled work, and enough honest effort to make the rest of the week feel wider.", image: "/manus-storage/atlas-zone-capacity_39af5fd7.jpg", route: "/programs" },
  { id: "restore", number: "03", title: "The restore room", label: "Range, attention, continuity", copy: "A quieter space for mobility, recovery, and rebuilding a dependable rhythm after the work is done.", image: "/manus-storage/atlas-zone-restore_470b9ba5.jpg", route: "/journal" },
];

export function AtlasExplorer() {
  const [active, setActive] = useState("strength");
  const zone = zones.find((item) => item.id === active) ?? zones[0];
  return <section className="atlas-explorer" aria-labelledby="explorer-title"><div className="explorer-head"><div><p className="eyebrow">JD Fitness Club / Explore the rooms</p><h2 id="explorer-title">A place for every kind of effort.</h2></div><p>Choose a room to see how the house supports the work you want to return to.</p></div><div className="explorer-stage"><div className="explorer-image-wrap"><img src={zone.image} alt={`${zone.title} at JD Fitness Club`} key={zone.image} /><div className="explorer-image-caption"><Compass size={15} /><span>{zone.label}</span></div></div><div className="explorer-detail"><span className="explorer-no">{zone.number}</span><p className="eyebrow">{zone.title}</p><h3>{zone.copy}</h3><Link href={zone.route}>See this practice <ArrowUpRight size={17} /></Link></div><div className="explorer-nav" role="tablist" aria-label="JD Fitness Club rooms">{zones.map((item) => <button role="tab" key={item.id} aria-selected={item.id === active} onClick={() => setActive(item.id)}><span>{item.number}</span><b>{item.title}</b><MoveRight size={16} /></button>)}</div></div></section>;
}
