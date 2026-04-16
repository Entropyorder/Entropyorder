import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Line, Environment } from '@react-three/drei';
import * as THREE from 'three';

const R = 1.6;
const S = R / Math.sqrt(3);
const VERTS = [
  new THREE.Vector3( S,  S,  S),
  new THREE.Vector3(-S, -S,  S),
  new THREE.Vector3(-S,  S, -S),
  new THREE.Vector3( S, -S, -S),
];

// 4 faces with distinct colors
const FACES = [
  { verts: [0, 1, 2], color: '#3b82f6', emissive: '#1d4ed8' },
  { verts: [0, 1, 3], color: '#22d3ee', emissive: '#0891b2' },
  { verts: [0, 2, 3], color: '#a78bfa', emissive: '#6d28d9' },
  { verts: [1, 2, 3], color: '#60a5fa', emissive: '#2563eb' },
];

// 6 edges
const EDGES = [
  [0, 1], [2, 3], [0, 2], [1, 3], [0, 3], [1, 2],
];
const EDGE_COLORS = ['#60a5fa', '#60a5fa', '#22d3ee', '#22d3ee', '#a78bfa', '#a78bfa'];

function TetraFace({ verts: vi, color, emissive, faceIndex }) {
  const meshRef = useRef();
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const positions = new Float32Array([
      ...VERTS[vi[0]].toArray(),
      ...VERTS[vi[1]].toArray(),
      ...VERTS[vi[2]].toArray(),
    ]);
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    g.computeVertexNormals();
    return g;
  }, []);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    meshRef.current.material.emissiveIntensity =
      0.35 + 0.18 * Math.sin(t * 1.1 + faceIndex * 1.1);
  });

  return (
    <mesh ref={meshRef} geometry={geo}>
      <meshStandardMaterial
        color={color}
        emissive={emissive}
        emissiveIntensity={0.35}
        metalness={0.25}
        roughness={0.3}
        transparent
        opacity={0.28}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

function Tetrahedron() {
  const groupRef = useRef();
  const innerRef = useRef();

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();
    groupRef.current.rotation.y = t * 0.22;
    groupRef.current.rotation.x = t * 0.1;
    groupRef.current.rotation.z = Math.sin(t * 0.3) * 0.08;
    if (innerRef.current) {
      innerRef.current.rotation.y = -t * 0.35;
      innerRef.current.rotation.x = -t * 0.18;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Per-face colored triangles */}
      {FACES.map((f, i) => (
        <TetraFace key={i} verts={f.verts} color={f.color} emissive={f.emissive} faceIndex={i} />
      ))}

      {/* Glowing wireframe edges */}
      {EDGES.map(([a, b], i) => (
        <Line
          key={i}
          points={[VERTS[a].toArray(), VERTS[b].toArray()]}
          color={EDGE_COLORS[i]}
          lineWidth={2}
          transparent
          opacity={0.9}
        />
      ))}

      {/* Inner counter-rotating smaller tetrahedron */}
      <group ref={innerRef} scale={0.5}>
        {EDGES.map(([a, b], i) => (
          <Line
            key={i}
            points={[VERTS[a].toArray(), VERTS[b].toArray()]}
            color={EDGE_COLORS[i]}
            lineWidth={1}
            transparent
            opacity={0.45}
          />
        ))}
      </group>

      {/* Vertex nodes */}
      {VERTS.map((v, i) => (
        <mesh key={i} position={v}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial
            color={FACES[i % FACES.length].color}
            emissive={FACES[i % FACES.length].color}
            emissiveIntensity={3.0}
          />
        </mesh>
      ))}
    </group>
  );
}

export function MultimodalArtifact() {
  return (
    <div className="w-full h-64 md:h-80">
      <Canvas
        camera={{ position: [0, 0, 5.5], fov: 45 }}
        dpr={[1, 2]}
        gl={{ toneMappingExposure: 1.4, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.4} />
        <pointLight position={[4, 4, 4]} intensity={5} color="#60a5fa" />
        <pointLight position={[-4, -3, 3]} intensity={4} color="#22d3ee" />
        <pointLight position={[0, -4, 2]} intensity={3} color="#a78bfa" />
        <Environment preset="night" />
        <Tetrahedron />
      </Canvas>
    </div>
  );
}
