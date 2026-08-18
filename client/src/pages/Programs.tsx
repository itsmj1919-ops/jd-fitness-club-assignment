/**
 * Monumental Athletics: program information is spacious, human, and specific rather than dashboard-like.
 */
import { ArrowUpRight, Clock3 } from "lucide-react";
import { Link } from "wouter";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";
import { SessionBuilder } from "@/components/SessionBuilder";
import { PracticeProgression } from "@/components/PracticeProgression";
import { useAtlasSection } from "@/hooks/useAtlasSection";

const hallImage = "/manus-storage/atlas-world-training-hall_62b4c288.jpg";

const programs = [
  { no: "01", title: "Foundation", time: "2–3 sessions / week", body: "An unhurried introduction to the room: movement assessment, pattern building, and a training plan that gives you a clear place to start.", detail: "Best for building confidence, capacity, and a reliable routine." },
  { no: "02", title: "Strength", time: "3–4 sessions / week", body: "Progressive barbell, kettlebell, and unilateral work rooted in good positions and careful loading—not spectacle.", detail: "Best for members ready to turn consistency into measurable strength." },
  { no: "03", title: "Capacity", time: "2–4 sessions / week", body: "Sleds, carries, intervals, and honest conditioning sessions designed to build an engine without exhausting the rest of your life.", detail: "Best for durable energy, useful endurance, and a clearer relationship with effort." },
  { no: "04", title: "Restore", time: "As needed", body: "Mobility, breath, and recovery sessions that create more options in your body and more continuity in your week.", detail: "Best for keeping training sustainable through changing seasons." },
];

export default function Programs() { const intro = useAtlasSection<HTMLElement>(); const architecture = useAtlasSection<HTMLElement>(); const programRows = useAtlasSection<HTMLElement>(); const closing = useAtlasSection<HTMLElement>(); return <div className="site-shell page-light"><SiteHeader /><main><section ref={intro.ref} className={`page-intro ${intro.className}`}><p className="eyebrow">Programs</p><h1>Four ways into<br />a more capable life.</h1><p>Choose a training focus. Your coach helps you turn it into a week that fits.</p></section><section ref={architecture.ref} className={`programs-architectural ${architecture.className}`}><img src={hallImage} alt="Morning light across the Performance Atlas training hall" /><div><p className="eyebrow-light">The training floor</p><h2>The room changes. The standard doesn’t.</h2><p className="material-caption">Basalt floor / blackened steel / daylight from the viaduct</p><p>Each program is built around the same simple promise: you will leave knowing exactly where your next session begins.</p></div></section><SessionBuilder /><PracticeProgression /><section ref={programRows.ref} className={`program-list ${programRows.className}`}><div className="training-floor-trace" aria-hidden="true"><span>Choose a room</span><i></i><span>Build a week</span><i></i><span>Return with intent</span></div>{programs.map((program) => <article key={program.no}><span className="program-no">{program.no}</span><div><h2>{program.title}</h2><p>{program.body}</p></div><div className="program-fact"><Clock3 size={16} /><span>{program.time}</span><small>{program.detail}</small></div><Link href="/visit" aria-label={`Plan a visit for ${program.title}`}><ArrowUpRight size={20} /></Link></article>)}</section><section ref={closing.ref} className={`page-close ${closing.className}`}><p className="eyebrow">Not sure where to start?</p><h2>Begin with a conversation, not a category.</h2><Link href="/visit" className="dark-button">Plan your first visit <ArrowUpRight size={17} /></Link></section></main><SiteFooter /></div>; }
