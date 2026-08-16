/**
 * Design philosophy: Sculpted Powerhouse — procedural 3D gym architecture that provides
 * meaningful zone selection and camera orientation without heavy imported 3D assets.
 */
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useMemo, useRef } from "react";
import { Color, Group, Vector3 } from "three";

export type GymZoneId = "strength" | "conditioning" | "mobility" | "recovery";

type ZoneVisual = {
  id: GymZoneId;
  label: string;
  position: [number, number, number];
  color: string;
  secondary: string;
};

const ZONES: ZoneVisual[] = [
  { id: "strength", label: "Strength", position: [-3.4, 0, -1.8], color: "#2E5BFF", secondary: "#F4F1EA" },
  { id: "conditioning", label: "Conditioning", position: [3.4, 0, -1.8], color: "#FF5B2D", secondary: "#F4F1EA" },
  { id: "mobility", label: "Mobility", position: [-3.4, 0, 3.1], color: "#8DAE9D", secondary: "#F4F1EA" },
  { id: "recovery", label: "Recovery", position: [3.4, 0, 3.1], color: "#E7B85A", secondary: "#F4F1EA" },
];

const CAMERA_POSITIONS: Record<GymZoneId | "overview", [number, number, number]> = {
  overview: [10.5, 8.2, 11.5],
  strength: [-7.2, 4.2, 3.2],
  conditioning: [7.4, 4.8, 2.7],
  mobility: [-6.6, 4.4, 8.1],
  recovery: [6.9, 4.5, 8.2],
};

const CAMERA_TARGETS: Record<GymZoneId | "overview", [number, number, number]> = {
  overview: [0, 0.4, 0.8],
  strength: [-3.4, 0.5, -1.8],
  conditioning: [3.4, 0.5, -1.8],
  mobility: [-3.4, 0.45, 3.1],
  recovery: [3.4, 0.55, 3.1],
};

function CameraRig({ activeZone, reducedMotion }: { activeZone: GymZoneId | "overview"; reducedMotion: boolean }) {
  const { camera } = useThree();
  const controls = useRef<any>(null);
  const desiredPosition = useMemo(() => new Vector3(), []);
  const desiredTarget = useMemo(() => new Vector3(), []);

  useFrame(() => {
    desiredPosition.set(...CAMERA_POSITIONS[activeZone]);
    desiredTarget.set(...CAMERA_TARGETS[activeZone]);
    const speed = reducedMotion ? 1 : 0.06;
    camera.position.lerp(desiredPosition, speed);
    controls.current?.target.lerp(desiredTarget, speed);
    controls.current?.update();
  });

  return <OrbitControls ref={controls} enablePan={false} minDistance={7} maxDistance={17} maxPolarAngle={1.32} minPolarAngle={0.62} />;
}

function Beacon({ color, active }: { color: string; active: boolean }) {
  const light = useRef<any>(null);
  useFrame(({ clock }) => {
    if (light.current) light.current.intensity = active ? 7 + Math.sin(clock.elapsedTime * 2.4) * 1.8 : 1.4;
  });
  return <pointLight ref={light} color={color} intensity={active ? 7 : 1.4} distance={active ? 7.5 : 3.5} decay={1.8} />;
}

function StrengthEquipment() {
  return (
    <group>
      <mesh position={[-0.9, 1.25, 0]}><boxGeometry args={[0.12, 2.5, 0.12]} /><meshStandardMaterial color="#090A0C" metalness={0.8} roughness={0.22} /></mesh>
      <mesh position={[0.9, 1.25, 0]}><boxGeometry args={[0.12, 2.5, 0.12]} /><meshStandardMaterial color="#090A0C" metalness={0.8} roughness={0.22} /></mesh>
      <mesh position={[0, 2.12, 0]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.06, 0.06, 2.4, 18]} /><meshStandardMaterial color="#B3B4B2" metalness={0.94} roughness={0.15} /></mesh>
      <mesh position={[-1.18, 2.12, 0]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.32, 0.32, 0.12, 28]} /><meshStandardMaterial color="#151719" roughness={0.55} /></mesh>
      <mesh position={[1.18, 2.12, 0]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.32, 0.32, 0.12, 28]} /><meshStandardMaterial color="#151719" roughness={0.55} /></mesh>
    </group>
  );
}

function ConditioningEquipment() {
  return (
    <group rotation={[0, -0.35, 0]}>
      <mesh position={[0, 0.13, 0]}><boxGeometry args={[2.25, 0.18, 0.95]} /><meshStandardMaterial color="#24262A" roughness={0.7} /></mesh>
      <mesh position={[0, 0.37, -0.35]}><boxGeometry args={[2.18, 0.35, 0.13]} /><meshStandardMaterial color="#FF5B2D" emissive="#FF5B2D" emissiveIntensity={0.25} /></mesh>
      {[[-0.85, 0.45], [-0.25, 0.45], [0.35, 0.45], [0.95, 0.45]].map(([x, z]) => <mesh key={`${x}-${z}`} position={[x, 0.75, z]}><boxGeometry args={[0.08, 1.2, 0.08]} /><meshStandardMaterial color="#101114" metalness={0.55} roughness={0.35} /></mesh>)}
    </group>
  );
}

function MobilityEquipment() {
  return (
    <group>
      <mesh position={[0, 0.08, 0]}><boxGeometry args={[2.5, 0.13, 1.7]} /><meshStandardMaterial color="#1D2622" roughness={0.9} /></mesh>
      <mesh position={[-0.58, 0.26, 0.2]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.18, 0.18, 1.1, 22]} /><meshStandardMaterial color="#8DAE9D" roughness={0.62} /></mesh>
      <mesh position={[0.48, 0.31, -0.25]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.15, 0.15, 0.82, 22]} /><meshStandardMaterial color="#2E5BFF" roughness={0.62} /></mesh>
    </group>
  );
}

function RecoveryEquipment() {
  return (
    <group>
      <mesh position={[0, 0.42, 0]}><boxGeometry args={[2.5, 0.2, 0.85]} /><meshStandardMaterial color="#493D32" roughness={0.78} /></mesh>
      <mesh position={[-0.95, 0.78, 0]} rotation={[0, 0, -0.12]}><boxGeometry args={[0.12, 0.8, 0.75]} /><meshStandardMaterial color="#151719" metalness={0.35} roughness={0.5} /></mesh>
      <mesh position={[0.95, 0.78, 0]} rotation={[0, 0, 0.12]}><boxGeometry args={[0.12, 0.8, 0.75]} /><meshStandardMaterial color="#151719" metalness={0.35} roughness={0.5} /></mesh>
      <mesh position={[0.35, 0.7, 0]}><sphereGeometry args={[0.21, 24, 24]} /><meshStandardMaterial color="#E7B85A" emissive="#E7B85A" emissiveIntensity={0.42} /></mesh>
    </group>
  );
}

function Zone({ zone, active, onSelect }: { zone: ZoneVisual; active: boolean; onSelect: (id: GymZoneId) => void }) {
  const group = useRef<Group>(null);
  useFrame(({ clock }) => {
    if (!group.current) return;
    const targetY = active ? 0.18 : 0;
    group.current.position.y += (targetY - group.current.position.y) * 0.08;
    group.current.rotation.y = active ? Math.sin(clock.elapsedTime * 0.5) * 0.025 : 0;
  });

  return (
    <group ref={group} position={zone.position} onClick={(event) => { event.stopPropagation(); onSelect(zone.id); }} onPointerOver={() => { document.body.style.cursor = "pointer"; }} onPointerOut={() => { document.body.style.cursor = "default"; }}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}><cylinderGeometry args={[2.22, 2.22, 0.08, 48]} /><meshStandardMaterial color={active ? zone.color : "#202329"} emissive={new Color(active ? zone.color : "#0B0C0E")} emissiveIntensity={active ? 0.55 : 0.05} roughness={0.72} /></mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.08, 0]}><ringGeometry args={[2.05, 2.14, 48]} /><meshBasicMaterial color={zone.color} transparent opacity={active ? 1 : 0.42} /></mesh>
      <group position={[0, 0.12, 0]}>{zone.id === "strength" ? <StrengthEquipment /> : zone.id === "conditioning" ? <ConditioningEquipment /> : zone.id === "mobility" ? <MobilityEquipment /> : <RecoveryEquipment />}</group>
      <Beacon color={zone.color} active={active} />
    </group>
  );
}

function GymScene({ activeZone, onZoneChange, reducedMotion }: { activeZone: GymZoneId | "overview"; onZoneChange: (id: GymZoneId) => void; reducedMotion: boolean }) {
  return (
    <>
      <color attach="background" args={["#111216"]} />
      <fog attach="fog" args={["#111216", 11, 25]} />
      <ambientLight intensity={0.78} color="#9EABC2" />
      <directionalLight position={[-7, 10, 2]} intensity={3.2} color="#F4F1EA" castShadow />
      <pointLight position={[0, 5, -4]} intensity={4} color="#2E5BFF" distance={18} decay={1.7} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.08, 0]} receiveShadow><planeGeometry args={[20, 20]} /><meshStandardMaterial color="#17181C" roughness={0.95} metalness={0.05} /></mesh>
      <gridHelper args={[20, 20, "#2D323C", "#202228"]} position={[0, 0.01, 0]} />
      {ZONES.map((zone) => <Zone key={zone.id} zone={zone} active={activeZone === zone.id} onSelect={onZoneChange} />)}
      <mesh position={[0, 0.15, 0]}><cylinderGeometry args={[1.12, 1.12, 0.25, 48]} /><meshStandardMaterial color="#101114" metalness={0.52} roughness={0.3} /></mesh>
      <mesh position={[0, 0.36, 0]}><cylinderGeometry args={[0.84, 0.98, 0.21, 48]} /><meshStandardMaterial color="#2E5BFF" emissive="#2E5BFF" emissiveIntensity={0.32} metalness={0.45} roughness={0.35} /></mesh>
      <CameraRig activeZone={activeZone} reducedMotion={reducedMotion} />
    </>
  );
}

export function GymCanvas({ activeZone, onZoneChange, reducedMotion }: { activeZone: GymZoneId | "overview"; onZoneChange: (id: GymZoneId) => void; reducedMotion: boolean }) {
  return (
    <Canvas shadows dpr={[1, 1.5]} camera={{ position: CAMERA_POSITIONS.overview, fov: 43 }} gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }} fallback={<div className="grid h-full place-items-center bg-[#151719] p-8 text-center text-sm text-[#F4F1EA]">Your device is using the 2D gym explorer below.</div>}>
      <GymScene activeZone={activeZone} onZoneChange={onZoneChange} reducedMotion={reducedMotion} />
    </Canvas>
  );
}
