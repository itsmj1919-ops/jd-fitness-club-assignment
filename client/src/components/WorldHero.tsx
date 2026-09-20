/**
 * JD Fitness Club: a believable architectural world, with WebGL as an atmospheric enhancement—not a content gate.
 */
import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import type { Group } from "three";
import { ArrowDownRight, Pause, Play, Volume2, VolumeX } from "lucide-react";

const worldVideo = "/manus-storage/atlas-training-world_41bf3e28.mp4";
const worldStill = "/manus-storage/atlas-world-training-hall_62b4c288.jpg";

function AtlasArchitecture() {
  const group = useRef<Group>(null);
  useFrame((state) => { if (group.current) { group.current.rotation.y += (state.pointer.x * 0.08 - group.current.rotation.y) * 0.025; group.current.rotation.x += (-state.pointer.y * 0.04 - group.current.rotation.x) * 0.025; } });
  return <group ref={group} position={[1.25, 0.1, 0]}><mesh rotation={[Math.PI / 2, 0, 0]}><ringGeometry args={[0.16, 0.165, 36]} /><meshBasicMaterial color="#315BFF" transparent opacity={0.92} /></mesh><mesh position={[-1.9, -.58, -.4]}><planeGeometry args={[1.5, .008]} /><meshBasicMaterial color="#315BFF" transparent opacity={.48} /></mesh><mesh position={[-.25, .88, -.6]}><planeGeometry args={[.56, .004]} /><meshBasicMaterial color="#ffffff" transparent opacity={.25} /></mesh><pointLight color="#315BFF" intensity={.8} distance={3} /></group>;
}

function WorldOverlay({ active }: { active: boolean }) {
  return <Canvas className="world-canvas" dpr={[1, 1.25]} frameloop={active ? "always" : "demand"} gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }} camera={{ position: [0, 0, 4], fov: 38 }} role="img" aria-label="Subtle interactive architectural light overlay on the JD Fitness Club training hall"><ambientLight intensity={0.32} /><AtlasArchitecture /></Canvas>;
}

export function WorldHero() {
  const heroRef = useRef<HTMLElement>(null); const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true); const [playing, setPlaying] = useState(true); const [visible, setVisible] = useState(true);
  useEffect(() => { const target = heroRef.current; if (!target) return; const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: .12 }); observer.observe(target); return () => observer.disconnect(); }, []);
  useEffect(() => { const video = videoRef.current; if (!video) return; if (visible && playing) video.play().catch(() => setPlaying(false)); else video.pause(); }, [visible, playing]);
  const toggleSound = () => { const video = videoRef.current; if (!video) return; video.muted = !muted; setMuted(!muted); };
  const togglePlay = () => setPlaying((value) => !value);
  return <section className="world-hero" ref={heroRef}><div className="world-media"><video ref={videoRef} autoPlay loop muted playsInline preload="metadata" poster={worldStill}><source src={worldVideo} type="video/mp4" /></video><div className="world-film" /></div><WorldOverlay active={visible} /><div className="world-content"><p className="eyebrow-light"><i /> A training house in the city</p><h1>A better room<br />for the <em>work</em><br />that matters.</h1><p className="hero-copy">JD Fitness Club is a place to train with exacting coaches, generous spaces, and a system you can return to.</p><div className="hero-actions"><a href="#entry" className="hero-cta">Enter the house <ArrowDownRight size={17} /></a><span>Scroll to explore</span></div></div><div className="world-coordinates" aria-hidden="true"><span>40° 44′ N</span><i /><span>73° 59′ W</span></div><div className="world-controls"><button onClick={togglePlay} aria-label={playing ? "Pause gym film" : "Play gym film"} aria-pressed={playing}>{playing ? <Pause size={15} /> : <Play size={15} />}</button><button onClick={toggleSound} aria-label={muted ? "Turn on gym film sound" : "Mute gym film sound"} aria-pressed={!muted}>{muted ? <VolumeX size={15} /> : <Volume2 size={15} />}</button></div></section>;
}
