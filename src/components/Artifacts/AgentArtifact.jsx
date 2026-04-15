import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere } from '@react-three/drei';

function Cluster() {
  const groupRef = useRef();
  const spheres = useMemo(() => {
    return Array.from({ length: 12 }, () => ({
      position: [(Math.random() - 0.5) * 3, (Math.random() - 0.5) * 3, (Math.random() - 0.5) * 3],
      scale: Math.random() * 0.3 + 0.1,
      speed: Math.random() * 0.5 + 0.2,
    }));
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.05;
    groupRef.current.rotation.z = Math.sin(state.clock.getElapsedTime() * 0.2) * 0.1;
  });

  return (
    <group ref={groupRef}>
      {spheres.map((s, i) => (
        <Sphere key={i} args={[s.scale, 16, 16]} position={s.position}>
          <meshStandardMaterial color="#3b82f6" emissive="#2563eb" emissiveIntensity={0.3} metalness={0.5} roughness={0.3} transparent opacity={0.9} />
        </Sphere>
      ))}
    </group>
  );
}

export function AgentArtifact() {
  return (
    <div className="w-full h-64 md:h-96">
      <Canvas camera={{ position: [0, 0, 5] }} dpr={[1, 1.5]}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[2, 2, 2]} intensity={1} />
        <Cluster />
      </Canvas>
    </div>
  );
}
