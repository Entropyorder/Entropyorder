import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Line, Environment } from '@react-three/drei';
import * as THREE from 'three';

const NODE_COLORS = ['#3b82f6', '#22d3ee', '#60a5fa', '#818cf8', '#06b6d4'];
const SPHERE_RADIUS = 1.8;
const N_NODES = 22;
const CONNECT_THRESHOLD = SPHERE_RADIUS * 1.15;

function buildSphereNetwork() {
  // Fibonacci sphere — evenly distributed points
  const phi = Math.PI * (3 - Math.sqrt(5));
  const nodes = Array.from({ length: N_NODES }, (_, i) => {
    const y = 1 - (i / (N_NODES - 1)) * 2;
    const r = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = phi * i;
    return {
      position: new THREE.Vector3(r * Math.cos(theta), y, r * Math.sin(theta))
        .multiplyScalar(SPHERE_RADIUS),
      color: NODE_COLORS[i % NODE_COLORS.length],
      speed: 0.5 + (i % 7) * 0.25,
      phase: (i * 0.618) * Math.PI * 2,
    };
  });

  const edges = [];
  for (let i = 0; i < N_NODES; i++) {
    for (let j = i + 1; j < N_NODES; j++) {
      if (nodes[i].position.distanceTo(nodes[j].position) < CONNECT_THRESHOLD) {
        edges.push({
          a: nodes[i].position.toArray(),
          b: nodes[j].position.toArray(),
          // Stagger the pulse phase per edge
          phase: (i + j * 0.5) * 0.8,
          speed: 0.6 + ((i + j) % 5) * 0.15,
        });
      }
    }
  }
  return { nodes, edges };
}

function NetworkSphere() {
  const groupRef = useRef();
  const nodeRefs = useRef([]);
  const lineRefs = useRef([]);

  const { nodes, edges } = useMemo(() => buildSphereNetwork(), []);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    groupRef.current.rotation.y = t * 0.07;
    groupRef.current.rotation.x = Math.sin(t * 0.18) * 0.1;

    // Pulse each node's emissive
    nodeRefs.current.forEach((mesh, i) => {
      if (!mesh?.material) return;
      const node = nodes[i];
      const v = 0.5 + 1.8 * Math.max(0, Math.sin(t * node.speed + node.phase));
      mesh.material.emissiveIntensity = v;
    });

    // Pulse edge opacity — travelling wave effect
    lineRefs.current.forEach((line, i) => {
      if (!line?.material) return;
      const e = edges[i];
      const v = 0.08 + 0.35 * Math.max(0, Math.sin(t * e.speed + e.phase));
      line.material.opacity = v;
    });
  });

  return (
    <group ref={groupRef}>
      {edges.map((e, i) => (
        <Line
          key={`e-${i}`}
          ref={el => { lineRefs.current[i] = el; }}
          points={[e.a, e.b]}
          color="#60a5fa"
          lineWidth={0.8}
          transparent
          opacity={0.15}
        />
      ))}
      {nodes.map((node, i) => (
        <mesh
          key={i}
          ref={el => { nodeRefs.current[i] = el; }}
          position={node.position}
        >
          <sphereGeometry args={[0.075, 14, 14]} />
          <meshStandardMaterial
            color={node.color}
            emissive={node.color}
            emissiveIntensity={1.0}
          />
        </mesh>
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
        <pointLight position={[0, 3, 2]} intensity={2} color="#818cf8" />
        <Environment preset="city" />
        <NetworkSphere />
      </Canvas>
    </div>
  );
}
