import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Line, Environment } from '@react-three/drei';
import * as THREE from 'three';

const SPHERE_COLORS = ['#3b82f6', '#22d3ee', '#60a5fa', '#818cf8', '#06b6d4'];

function NeuralCluster() {
  const groupRef = useRef();

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

    let meshIdx = 0;
    groupRef.current.children.forEach((child) => {
      if (child.isMesh && spheres[meshIdx]) {
        const s = spheres[meshIdx];
        const pulse = 1 + Math.sin(t * s.speed + s.phaseOffset) * 0.25;
        child.scale.setScalar(s.scale * pulse);
        meshIdx++;
      }
    });
  });

  return (
    <group ref={groupRef}>
      {connections.map(([a, b], i) => (
        <Line
          key={`line-${i}`}
          points={[a, b]}
          color="#60a5fa"
          lineWidth={0.5}
          transparent
          opacity={0.3}
        />
      ))}
      {spheres.map((s, i) => (
        <Sphere key={i} args={[s.scale, 20, 20]} position={s.position}>
          <meshStandardMaterial
            color={s.color}
            emissive={s.color}
            emissiveIntensity={1.0}
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
  return (
    <div className="w-full h-64 md:h-96">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        dpr={[1, 2]}
        gl={{ toneMappingExposure: 1.4 }}
      >
        <ambientLight intensity={0.2} />
        <pointLight position={[4, 4, 4]} intensity={4} color="#60a5fa" />
        <pointLight position={[-3, -3, 3]} intensity={3} color="#22d3ee" />
        <pointLight position={[0, 2, 2]} intensity={2} color="#818cf8" />
        <Environment preset="city" />
        <NeuralCluster />
      </Canvas>
    </div>
  );
}
