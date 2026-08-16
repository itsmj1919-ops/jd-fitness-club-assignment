/**
 * Monumental Athletics: a believable architectural world, with WebGL as an atmospheric enhancement—not a content gate.
 */
import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Group } from "three";
import { ArrowDownRight, Volume2, VolumeX } from "lucide-react";

const worldVideo = "/manus-storage/atlas-training-world_41bf3e28.mp4";
const worldStill = "/manus-storage/atlas-world-training-hall_62b4c288.jpg";

function AtlasBeacon() {
  const group = useRef<Group>(null);
  useFrame(({ clock }) => { if (group.current) { group.current.rotation.y = clock.elapsedTime * 0.15; group.current.position.y = Math.sin(clock.elapsedTime * 0.6) * 0.12; } });
  return <group ref={group} position={[1.8, 0.2, 0]}><mesh rotation={[Math.PI / 2, 0, 0]}><ringGeometry args={[0.62, 0.65, 72]} /><meshBasicMaterial color="#315BFF" transparent opacity={0.76} /></mesh><mesh><sphereGeometry args={[0.12, 24, 24]} /><meshStandardMaterial color="#315BFF" emissive="#315BFF" emissiveIntensity={3} /></mesh><pointLight color="#315BFF" intensity={2.8} distance={4} /></group>;
}

function WorldOverlay() {
  return <Canvas className="world-canvas" dpr={[1, 1.5]} gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }} camera={{ position: [0, 0, 4], fov: 38 }} aria-hidden="true"><ambientLight intensity={0.4} /><AtlasBeacon /></Canvas>;
}

export function WorldHero() {
  const toggleSound = (event: React.MouseEvent<HTMLButtonElement>) => { const video = document.getElementById("atlas-world-video") as HTMLVideoElement | null; if (!video) return; video.muted = !video.muted; event.currentTarget.setAttribute("aria-pressed", String(!video.muted)); event.currentTarget.innerHTML = video.muted ? "<svg viewBox='0 0 24 24' aria-hidden='true'><path d='M11 5 6 9H3v6h3l5 4V5Z' fill='none' stroke='currentColor' stroke-width='1.8'/><path d='M15.5 9.5a4 4 0 0 1 0 5' fill='none' stroke='currentColor' stroke-width='1.8'/><path d='m4 4 16 16' fill='none' stroke='currentColor' stroke-width='1.8'/></svg>" : "<svg viewBox='0 0 24 24' aria-hidden='true'><path d='M11 5 6 9H3v6h3l5 4V5Z' fill='none' stroke='currentColor' stroke-width='1.8'/><path d='M15.5 9.5a4 4 0 0 1 0 5' fill='none' stroke='currentColor' stroke-width='1.8'/></svg>"; };
  return <section className="world-hero"><div className="world-media"><video id="atlas-world-video" autoPlay loop muted playsInline poster={worldStill}><source src={worldVideo} type="video/mp4" /></video><div className="world-film" /></div><WorldOverlay /><div className="world-content"><p className="eyebrow-light"><i /> A training house in the city</p><h1>A better room<br />for the <em>work</em><br />that matters.</h1><p className="hero-copy">Performance Atlas is a place to train with exacting coaches, generous spaces, and a system you can return to.</p><div className="hero-actions"><a href="#entry" className="hero-cta">Enter the house <ArrowDownRight size={17} /></a><span>Scroll to explore</span></div></div><div className="world-coordinates" aria-hidden="true"><span>40° 44′ N</span><i /><span>73° 59′ W</span></div><button className="sound-toggle" onClick={toggleSound} aria-label="Toggle gym film sound" aria-pressed="false"><VolumeX size={17} /></button></section>;
}
