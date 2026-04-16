import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Line, Environment } from '@react-three/drei';
import * as THREE from 'three';

// Tetrahedron vertices: THREE.TetrahedronGeometry uses [1,1,1],[-1,-1,1],[-1,1,-1],[1,-1,-1]
// Each has magnitude sqrt(3). Scaled to radius 1.6:
const R = 1.6;
const S = R / Math.sqrt(3);
const VERTS = [
  new THREE.Vector3( S,  S,  S),  // v0
  new THREE.Vector3(-S, -S,  S),  // v1
  new THREE.Vector3(-S,  S, -S),  // v2
  new THREE.Vector3( S, -S, -S),  // v3
];

// 6 edges grouped by modality color
const EDGES = [
  { a: 0, b: 1, color: '#60a5fa', emissive: '#2563eb' }, // Video
  { a: 2, b: 3, color: '#60a5fa', emissive: '#2563eb' },
  { a: 0, b: 2, color: '#22d3ee', emissive: '#0891b2' }, // Audio
  { a: 1, b: 3, color: '#22d3ee', emissive: '#0891b2' },
  { a: 0, b: 3, color: '#a78bfa', emissive: '#6d28d9' }, // Text
  { a: 1, b: 2, color: '#a78bfa', emissive: '#6d28d9' },
];

const VERTEX_COLORS = ['#60a5fa', '#22d3ee', '#a78bfa', '#93c5fd'];

function Tetrahedron() {
  const groupRef = useRef();
  const faceRef = useRef();

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    groupRef.current.rotation.y = t * 0.22;
    groupRef.current.rotation.x = t * 0.1;
    groupRef.current.rotation.z = Math.sin(t * 0.3) * 0.08;

    if (faceRef.current) {
      faceRef.current.material.emissiveIntensity =
        0.3 + 0.15 * Math.sin(t * 1.2);
    }
  });

  return (
    <group ref={groupRef}>
      {/* Semi-transparent body */}
      <mesh ref={faceRef}>
        <tetrahedronGeometry args={[R, 0]} />
        <meshStandardMaterial
          color="#3b82f6"
          emissive="#1d4ed8"
          emissiveIntensity={0.3}
          metalness={0.3}
          roughness={0.2}
          transparent
          opacity={0.18}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Glowing edges */}
      {EDGES.map((e, i) => (
        <Line
          key={i}
          points={[VERTS[e.a].toArray(), VERTS[e.b].toArray()]}
          color={e.color}
          lineWidth={2.5}
          transparent
          opacity={0.9}
        />
      ))}

      {/* Vertex nodes */}
      {VERTS.map((v, i) => (
        <mesh key={i} position={v}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial
            color={VERTEX_COLORS[i]}
            emissive={VERTEX_COLORS[i]}
            emissiveIntensity={2.5}
          />
        </mesh>
      ))}
    </group>
  );
}

export function MultimodalArtifact() {
  return (
    <div className="w-full h-64 md:h-96">
      <Canvas
        camera={{ position: [0, 0, 5.5], fov: 45 }}
        dpr={[1, 2]}
        gl={{ toneMappingExposure: 1.4 }}
      >
        <ambientLight intensity={0.2} />
        <pointLight position={[4, 4, 4]} intensity={4} color="#60a5fa" />
        <pointLight position={[-4, -3, 3]} intensity={3} color="#22d3ee" />
        <pointLight position={[0, -4, 2]} intensity={2} color="#a78bfa" />
        <Environment preset="night" />
        <Tetrahedron />
      </Canvas>
    </div>
  );
}
