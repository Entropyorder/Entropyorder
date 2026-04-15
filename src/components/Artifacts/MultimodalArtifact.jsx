import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { TorusKnot, Environment } from '@react-three/drei';

const RIBBONS = [
  { color: '#60a5fa', emissive: '#2563eb', tubeRadius: 0.14, p: 2, q: 3, speed: 0.18, phase: 0 },
  { color: '#22d3ee', emissive: '#0891b2', tubeRadius: 0.11, p: 3, q: 2, speed: 0.22, phase: Math.PI * 0.66 },
  { color: '#a78bfa', emissive: '#4f46e5', tubeRadius: 0.10, p: 2, q: 5, speed: 0.16, phase: Math.PI * 1.33 },
];

function Ribbon({ color, emissive, tubeRadius, p, q, speed, phase }) {
  const meshRef = useRef();
  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();
    meshRef.current.rotation.x = Math.sin(t * speed + phase) * 0.8;
    meshRef.current.rotation.y = t * speed * 0.7 + phase;
    meshRef.current.rotation.z = Math.cos(t * speed * 0.5 + phase) * 0.4;
  });
  return (
    <TorusKnot ref={meshRef} args={[0.9, tubeRadius, 128, 16, p, q]}>
      <meshStandardMaterial
        color={color}
        emissive={emissive}
        emissiveIntensity={1.4}
        metalness={0.7}
        roughness={0.1}
        transparent
        opacity={0.9}
      />
    </TorusKnot>
  );
}

export function MultimodalArtifact() {
  return (
    <div className="w-full h-64 md:h-96">
      <Canvas
        camera={{ position: [0, 0, 5.5], fov: 45 }}
        dpr={[1, 2]}
        gl={{ toneMappingExposure: 1.5 }}
      >
        <ambientLight intensity={0.15} />
        <pointLight position={[4, 4, 4]} intensity={5} color="#60a5fa" />
        <pointLight position={[-4, -3, 3]} intensity={4} color="#22d3ee" />
        <pointLight position={[0, 0, 3]} intensity={3} color="#a78bfa" />
        <Environment preset="night" />
        {RIBBONS.map((r, i) => (
          <Ribbon key={i} {...r} />
        ))}
      </Canvas>
    </div>
  );
}
