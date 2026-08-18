/**
 * Monumental Athletics: ManimCE progression loop, presented as optional controlled media with a reading-safe fallback.
 */
import { Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const progressionVideo = "/manus-storage/final_abe381c2.mp4";

export function PracticeProgression() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [playing, setPlaying] = useState(false);
  useEffect(() => { const target = sectionRef.current; if (!target) return; const observer = new IntersectionObserver(([entry]) => { if (!entry.isIntersecting && videoRef.current) { videoRef.current.pause(); setPlaying(false); } }, { threshold: .18 }); observer.observe(target); return () => observer.disconnect(); }, []);
  const toggle = () => { const video = videoRef.current; if (!video) return; if (video.paused) { video.play(); setPlaying(true); } else { video.pause(); setPlaying(false); } };
  return <section className="progression-media" ref={sectionRef} aria-labelledby="progression-title"><div><p className="eyebrow">The practice, in motion</p><h2 id="progression-title">Foundation. Load. Capacity. Restore.</h2><p>A concise view of how a week becomes a training practice—not a sprint toward an arbitrary finish line.</p><button onClick={toggle} aria-pressed={playing}>{playing ? <Pause size={15} /> : <Play size={15} />}{playing ? "Pause progression" : "Play progression"}</button></div><figure><video ref={videoRef} muted playsInline preload="metadata" poster="/manus-storage/atlas-zone-capacity_39af5fd7.jpg"><source src={progressionVideo} type="video/mp4" /></video><figcaption>Performance Atlas / Practice progression</figcaption></figure></section>;
}
