/**
 * JD Fitness Club: one route-aware, quality-tiered spatial layer; decorative only and never a content gate.
 */
import { Canvas, useFrame } from "@react-three/fiber";
import { Map, X } from "lucide-react";
import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { Group } from "three";
import { Link, useLocation } from "wouter";

type RoomId = "arrival" | "training" | "coaching" | "member" | "library" | "atrium";
type Room = { id: RoomId; route: string; number: string; name: string; description: string; accent: string; coordinate: [number, number, number] };

const rooms: Room[] = [
  { id: "arrival", route: "/", number: "01", name: "Arrival Hall", description: "A first view of the training house.", accent: "#315BFF", coordinate: [-1.1, .45, -.5] },
  { id: "training", route: "/programs", number: "02", name: "Training Floor", description: "Strength, capacity, and repeatable effort.", accent: "#315BFF", coordinate: [.8, -.35, -.4] },
  { id: "coaching", route: "/coaches", number: "03", name: "Coaching Room", description: "Close attention and clear instruction.", accent: "#9A5A3A", coordinate: [-.65, -.05, -.6] },
  { id: "member", route: "/membership", number: "04", name: "Member House", description: "A cadence with room around it.", accent: "#315BFF", coordinate: [.6, .25, -.55] },
  { id: "library", route: "/journal", number: "05", name: "Recovery Library", description: "Notes for the days between sessions.", accent: "#9A5A3A", coordinate: [-.85, .28, -.45] },
  { id: "atrium", route: "/visit", number: "06", name: "Visit Atrium", description: "A calm way to find your starting point.", accent: "#315BFF", coordinate: [.5, -.18, -.45] },
];

type WorldContextType = { room: Room; mapOpen: boolean; setMapOpen: (open: boolean) => void };
const WorldContext = createContext<WorldContextType | null>(null);
export const useAtlasWorld = () => useContext(WorldContext);

function Matter({ room }: { room: Room }) {
  const group = useRef<Group>(null);
  useFrame((state, delta) => {
    if (!group.current) return;
    const targetX = state.pointer.y * .055;
    const targetY = state.pointer.x * .09;
    group.current.rotation.x += (targetX - group.current.rotation.x) * Math.min(1, delta * 2.5);
    group.current.rotation.y += (targetY - group.current.rotation.y) * Math.min(1, delta * 2.5);
  });
  return <group ref={group} position={room.coordinate}>
    <mesh position={[0, 0, 0]}><planeGeometry args={[1.7, .012]} /><meshBasicMaterial color={room.accent} transparent opacity={.25} /></mesh>
    <mesh position={[.72, .48, -.16]} rotation={[0, 0, Math.PI / 4]}><ringGeometry args={[.065, .07, 32]} /><meshBasicMaterial color={room.accent} transparent opacity={.85} /></mesh>
    <mesh position={[-.45, -.38, -.2]}><planeGeometry args={[.55, .006]} /><meshBasicMaterial color="#f7f5f0" transparent opacity={.12} /></mesh>
  </group>;
}

function AmbientWorld({ room, active, dpr }: { room: Room; active: boolean; dpr: number }) {
  return <Canvas className="atlas-world-canvas" dpr={[1, dpr]} frameloop={active ? "always" : "demand"} gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }} camera={{ position: [0, 0, 3.6], fov: 40 }} aria-hidden="true"><ambientLight intensity={.3} /><Matter room={room} /></Canvas>;
}

function AtlasHouseMap({ open, onClose, activeRoom }: { open: boolean; onClose: () => void; activeRoom: Room }) {
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    const handleKey = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKey);
    return () => { document.body.style.overflow = previous; window.removeEventListener("keydown", handleKey); };
  }, [open, onClose]);
  if (!open) return null;
  return <div className="atlas-map-backdrop" onMouseDown={onClose}><section className="atlas-map" role="dialog" aria-modal="true" aria-labelledby="atlas-map-title" onMouseDown={(event) => event.stopPropagation()}><button onClick={onClose} className="atlas-map-close" aria-label="Close JD Fitness Club map"><X size={18} /></button><div className="atlas-map-intro"><p className="eyebrow">JD Fitness Club / 6 rooms</p><h2 id="atlas-map-title">Find a room for the work.</h2><p>Each room opens into a complete part of the JD Fitness Club practice. Choose a place, then follow the route.</p></div><div className="atlas-map-grid">{rooms.map((room) => <Link href={room.route} key={room.id} onClick={onClose} className={room.id === activeRoom.id ? "active" : ""}><span>{room.number}</span><b>{room.name}</b><small>{room.description}</small><i style={{ background: room.accent }} /></Link>)}</div><p className="atlas-map-note"><Map size={14} /> Full navigation remains available in the header and command palette.</p></section></div>;
}

export function AtlasWorldRuntime({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const room = useMemo(() => rooms.find((item) => item.route === location) ?? rooms[0], [location]);
  const [mapOpen, setMapOpen] = useState(false);
  const [active, setActive] = useState(true);
  const [reduced, setReduced] = useState(false);
  const [dpr, setDpr] = useState(1.25);
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const coarse = window.matchMedia("(pointer: coarse)");
    const update = () => { setReduced(media.matches); const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8; setDpr(media.matches || coarse.matches || memory <= 4 ? 1 : 1.25); };
    const visibility = () => setActive(document.visibilityState === "visible");
    update(); visibility(); media.addEventListener("change", update); coarse.addEventListener("change", update); document.addEventListener("visibilitychange", visibility);
    return () => { media.removeEventListener("change", update); coarse.removeEventListener("change", update); document.removeEventListener("visibilitychange", visibility); };
  }, []);
  useEffect(() => { document.documentElement.dataset.atlasRoom = room.id; }, [room.id]);
  const value = useMemo(() => ({ room, mapOpen, setMapOpen }), [room, mapOpen]);
  return <WorldContext.Provider value={value}><div className={`atlas-world-runtime atlas-room-${room.id}`} aria-hidden="true">{!reduced && <AmbientWorld room={room} active={active} dpr={dpr} />}<div className="atlas-world-grain" /></div><div className="atlas-route-transition" key={location} aria-hidden="true"><i style={{ background: room.accent }} /></div>{children}<AtlasHouseMap open={mapOpen} onClose={() => setMapOpen(false)} activeRoom={room} /></WorldContext.Provider>;
}
