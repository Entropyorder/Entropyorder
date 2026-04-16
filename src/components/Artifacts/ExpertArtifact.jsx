import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Torus, Environment } from '@react-three/drei';

// Euler angles for each orbital plane (evenly spaced 120° apart, all tilted 90° to be vertical)
const ORBITS = [
  { tiltX: Math.PI / 2, tiltY: 0,                    speed: 1.1,  color: '#60a5fa', emissive: '#2563eb' },
  { tiltX: Math.PI / 2, tiltY: Math.PI * 2 / 3,      speed: 0.85, color: '#22d3ee', emissive: '#0891b2' },
  { tiltX: Math.PI / 2, tiltY: Math.PI * 4 / 3,      speed: 1.0,  color: '#a78bfa', emissive: '#6d28d9' },
];

const ORBIT_RADIUS = 1.5;

function Orbit({ tiltX, tiltY, speed, color, emissive }) {
  const electronRef = useRef();

  useFrame((state) => {
    if (!electronRef.current) return;
    const angle = state.clock.getElapsedTime() * speed;
    // Move in local XY plane — group rotation handles the tilt
    electronRef.current.position.set(
      ORBIT_RADIUS * Math.cos(angle),
      ORBIT_RADIUS * Math.sin(angle),
      0
    );
  });

  return (
    <group rotation={[tiltX, tiltY, 0]}>
      {/* Orbital ring */}
      <Torus args={[ORBIT_RADIUS, 0.018, 16, 128]}>
        <meshStandardMaterial
          color={color}
          emissive={emissive}
          emissiveIntensity={0.9}
          metalness={0.6}
          roughness={0.1}
          transparent
          opacity={0.65}
        />
      </Torus>
      {/* Electron */}
      <mesh ref={electronRef}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={3.5}
        />
      </mesh>
    </group>
  );
}

function Atom() {
  const groupRef = useRef();

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    groupRef.current.rotation.y = t * 0.18;
    groupRef.current.rotation.x = Math.sin(t * 0.25) * 0.15;
  });

  return (
    <group ref={groupRef}>
      {/* Nucleus */}
      <Sphere args={[0.3, 32, 32]}>
        <meshStandardMaterial
          color="#e0f2fe"
          emissive="#60a5fa"
          emissiveIntensity={2.8}
          metalness={0.8}
          roughness={0.05}
        />
      </Sphere>
      {/* Inner glow halo */}
      <Sphere args={[0.42, 32, 32]}>
        <meshStandardMaterial
          color="#3b82f6"
          emissive="#3b82f6"
          emissiveIntensity={0.6}
          transparent
          opacity={0.12}
        />
      </Sphere>
      {ORBITS.map((o, i) => (
        <Orbit key={i} {...o} />
      ))}
    </group>
  );
}

export function ExpertArtifact() {
  return (
    <div className="w-full h-64 md:h-96">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        dpr={[1, 2]}
        gl={{ toneMappingExposure: 1.3 }}
      >
        <ambientLight intensity={0.15} />
        <pointLight position={[4, 4, 4]} intensity={3} color="#60a5fa" />
        <pointLight position={[-4, -3, 3]} intensity={2} color="#22d3ee" />
        <Environment preset="city" />
        <Atom />
      </Canvas>
    </div>
  );
}
