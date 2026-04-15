import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { TorusKnot, Environment } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';

const RIBBONS = [
  { color: '#2563eb', emissive: '#1d4ed8', tubeRadius: 0.14, p: 2, q: 3, speed: 0.18, phase: 0 },
  { color: '#22d3ee', emissive: '#0891b2', tubeRadius: 0.11, p: 3, q: 2, speed: 0.22, phase: Math.PI * 0.66 },
  { color: '#818cf8', emissive: '#4f46e5', tubeRadius: 0.10, p: 2, q: 5, speed: 0.16, phase: Math.PI * 1.33 },
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
        emissiveIntensity={0.6}
        metalness={0.7}
        roughness={0.1}
        transparent
        opacity={0.88}
      />
    </TorusKnot>
  );
}

export function MultimodalArtifact() {
  const isDark = document.documentElement.classList.contains('dark');
  return (
    <div className="w-full h-64 md:h-96">
      <Canvas camera={{ position: [0, 0, 5.5], fov: 45 }} dpr={[1, 2]}>
        <ambientLight intensity={0.2} />
        <pointLight position={[5, 5, 5]} intensity={1.5} color="#60a5fa" />
        <pointLight position={[-5, -3, 3]} intensity={1} color="#22d3ee" />
        <Environment preset="night" />
        {RIBBONS.map((r, i) => (
          <Ribbon key={i} {...r} />
        ))}
        <EffectComposer>
          <Bloom
            luminanceThreshold={0.2}
            luminanceSmoothing={0.9}
            intensity={isDark ? 2.2 : 1.0}
            radius={0.9}
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
