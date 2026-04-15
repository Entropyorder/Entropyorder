import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Line, Environment } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';

const SPHERE_COLORS = ['#3b82f6', '#22d3ee', '#60a5fa', '#818cf8', '#06b6d4'];

function NeuralCluster() {
  const groupRef = useRef();
  const clockRef = useRef(0);

  const spheres = useMemo(() => {
    return Array.from({ length: 14 }, (_, i) => ({
      position: new THREE.Vector3(
        (Math.random() - 0.5) * 3.2,
        (Math.random() - 0.5) * 3.2,
        (Math.random() - 0.5) * 3.2
      ),
      scale: Math.random() * 0.18 + 0.09,
      speed: Math.random() * 0.6 + 0.3,
      phaseOffset: Math.random() * Math.PI * 2,
      color: SPHERE_COLORS[i % SPHERE_COLORS.length],
    }));
  }, []);

  // Build connections between nearest neighbors
  const connections = useMemo(() => {
    const lines = [];
    const threshold = 2.0;
    for (let i = 0; i < spheres.length; i++) {
      for (let j = i + 1; j < spheres.length; j++) {
        if (spheres[i].position.distanceTo(spheres[j].position) < threshold) {
          lines.push([spheres[i].position.toArray(), spheres[j].position.toArray()]);
        }
      }
    }
    return lines;
  }, [spheres]);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    groupRef.current.rotation.y = t * 0.06;
    groupRef.current.rotation.x = Math.sin(t * 0.15) * 0.12;

    groupRef.current.children.forEach((child, i) => {
      if (child.isMesh && spheres[i]) {
        const s = spheres[i];
        const pulse = 1 + Math.sin(t * s.speed + s.phaseOffset) * 0.25;
        const base = s.scale;
        child.scale.setScalar(base * pulse);
      }
    });
    clockRef.current = t;
  });

  return (
    <group ref={groupRef}>
      {connections.map(([a, b], i) => (
        <Line
          key={`line-${i}`}
          points={[a, b]}
          color="#3b82f6"
          lineWidth={0.6}
          transparent
          opacity={0.25}
        />
      ))}
      {spheres.map((s, i) => (
        <Sphere key={i} args={[s.scale, 20, 20]} position={s.position}>
          <meshStandardMaterial
            color={s.color}
            emissive={s.color}
            emissiveIntensity={0.5}
            metalness={0.4}
            roughness={0.2}
            transparent
            opacity={0.92}
          />
        </Sphere>
      ))}
    </group>
  );
}

export function AgentArtifact() {
  const isDark = document.documentElement.classList.contains('dark');
  return (
    <div className="w-full h-64 md:h-96">
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }} dpr={[1, 2]}>
        <ambientLight intensity={0.3} />
        <pointLight position={[4, 4, 4]} intensity={1.5} color="#60a5fa" />
        <pointLight position={[-3, -3, 3]} intensity={0.8} color="#22d3ee" />
        <Environment preset="city" />
        <NeuralCluster />
        <EffectComposer>
          <Bloom
            luminanceThreshold={0.2}
            luminanceSmoothing={0.9}
            intensity={isDark ? 2.0 : 0.9}
            radius={0.85}
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
