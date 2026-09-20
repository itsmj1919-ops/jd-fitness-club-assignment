/**
 * JD Fitness Club: elevate coaching through credible, editorial storytelling and clear expertise.
 */
import { ArrowUpRight } from "lucide-react";
import { Link } from "wouter";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";
import { CoachMatch } from "@/components/CoachMatch";
import { useAtlasSection } from "@/hooks/useAtlasSection";

const coachImage = "/manus-storage/atlas-coach-strength_66690ece.jpg";
const coachingRoomImage = "/manus-storage/atlas-world-coaching-room_557e0d32.jpg";
const coaches = [
  { initials: "ML", name: "Maya Laurent", role: "Strength & movement", bio: "Maya’s work starts with the question of what feels useful in a body. She brings a decade of barbell coaching into clear, calm sessions." },
  { initials: "JR", name: "Jules Rowan", role: "Capacity & field work", bio: "Jules builds conditioning sessions that are demanding without being punishing, with an eye on the rest of the week." },
  { initials: "NS", name: "Noor Shah", role: "Mobility & recovery", bio: "Noor helps members recover range, attention, and confidence after busy seasons, old injuries, or long periods away from training." },
];

export default function Coaches() { const hero = useAtlasSection<HTMLElement>(); const method = useAtlasSection<HTMLElement>(); const statement = useAtlasSection<HTMLElement>(); const list = useAtlasSection<HTMLElement>(); return <div className="site-shell"><SiteHeader /><main><section ref={hero.ref} className={`coaches-hero ${hero.className}`}><div><p className="eyebrow-light">The coaching room</p><h1>Attention is<br />a form of care.</h1><p>Our coaches are precise, observant, and very good at meeting you where you are.</p></div><img src={coachImage} alt="Coach assisting a member with barbell setup" /></section><CoachMatch /><section ref={method.ref} className={`coaching-method-room ${method.className}`}><img src={coachingRoomImage} alt="A coach and member reviewing a training plan in the quiet coaching room" /><div><p className="eyebrow-light">A close reading of the work</p><h2>Observe. Adjust. Return.</h2><p>Every room in the house has a purpose. The coaching room is where evidence becomes a next step you can actually keep.</p><Link href="/visit">Arrange a coaching introduction <ArrowUpRight size={16} /></Link></div></section><section ref={statement.ref} className={`coaches-statement ${statement.className}`}><p className="eyebrow">A shared practice</p><h2>Good coaching gives the work a shape.</h2><p>There is no performance of intensity here. You will be seen, challenged, and given enough context to make your next session feel familiar.</p></section><section ref={list.ref} className={`coach-list ${list.className}`}>{coaches.map((coach, index) => <article key={coach.initials}><span>{coach.initials}</span><div><p>0{index + 1} / {coach.role}</p><h2>{coach.name}</h2><p>{coach.bio}</p></div><Link href="/visit">Arrange an introduction <ArrowUpRight size={16} /></Link></article>)}</section></main><SiteFooter /></div>; }
