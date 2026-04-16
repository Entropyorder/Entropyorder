import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Torus, Environment } from '@react-three/drei';
import * as THREE from 'three';

const ORBITS = [
  { tiltX: Math.PI / 2, tiltY: 0,               speed: 1.1,  color: '#3b82f6', emissive: '#1d4ed8' },
  { tiltX: Math.PI / 2, tiltY: Math.PI * 2 / 3, speed: 0.85, color: '#22d3ee', emissive: '#0891b2' },
  { tiltX: Math.PI / 2, tiltY: Math.PI * 4 / 3, speed: 1.0,  color: '#a78bfa', emissive: '#6d28d9' },
];

const ORBIT_RADIUS = 1.5;

// Particle cloud orbiting the nucleus
function NucleusCloud() {
  const pointsRef = useRef();
  const { positions, phases } = useMemo(() => {
    const count = 80;
    const pos = new Float32Array(count * 3);
    const ph = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const r = 0.28 + Math.random() * 0.22;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      pos[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
      ph[i] = Math.random() * Math.PI * 2;
    }
    return { positions: pos, phases: ph };
  }, []);

  useFrame(({ clock }) => {
    if (!pointsRef.current) return;
    const t = clock.getElapsedTime();
    pointsRef.current.rotation.y = t * 0.4;
    pointsRef.current.rotation.x = t * 0.2;
    pointsRef.current.material.opacity = 0.55 + 0.25 * Math.sin(t * 1.4);
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#93c5fd"
        size={0.055}
        transparent
        opacity={0.7}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

function Orbit({ tiltX, tiltY, speed, color, emissive }) {
  const electronRef = useRef();

  useFrame(({ clock }) => {
    if (!electronRef.current) return;
    const angle = clock.getElapsedTime() * speed;
    electronRef.current.position.set(
      ORBIT_RADIUS * Math.cos(angle),
      ORBIT_RADIUS * Math.sin(angle),
      0
    );
  });

  return (
    <group rotation={[tiltX, tiltY, 0]}>
      <Torus args={[ORBIT_RADIUS, 0.016, 16, 128]}>
        <meshStandardMaterial
          color={color}
          emissive={emissive}
          emissiveIntensity={1.2}
          metalness={0.5}
          roughness={0.1}
          transparent
          opacity={0.7}
        />
      </Torus>
      <mesh ref={electronRef}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={4.0}
        />
      </mesh>
    </group>
  );
}

function Atom() {
  const groupRef = useRef();

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();
    groupRef.current.rotation.y = t * 0.18;
    groupRef.current.rotation.x = Math.sin(t * 0.25) * 0.15;
  });

  return (
    <group ref={groupRef}>
      {/* Particle cloud */}
      <NucleusCloud />
      {/* Nucleus */}
      <Sphere args={[0.28, 32, 32]}>
        <meshStandardMaterial
          color="#dbeafe"
          emissive="#3b82f6"
          emissiveIntensity={3.2}
          metalness={0.8}
          roughness={0.05}
        />
      </Sphere>
      {/* Inner glow halo */}
      <Sphere args={[0.44, 32, 32]}>
        <meshStandardMaterial
          color="#60a5fa"
          emissive="#3b82f6"
          emissiveIntensity={0.5}
          transparent
          opacity={0.1}
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
    <div className="w-full h-64 md:h-80">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        dpr={[1, 2]}
        gl={{ toneMappingExposure: 1.2, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[4, 4, 4]} intensity={4} color="#60a5fa" />
        <pointLight position={[-4, -3, 3]} intensity={3} color="#22d3ee" />
        <pointLight position={[0, -3, 2]} intensity={2} color="#a78bfa" />
        <Environment preset="city" />
        <Atom />
      </Canvas>
    </div>
  );
}
