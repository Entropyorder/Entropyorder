import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Line, Environment } from '@react-three/drei';
import * as THREE from 'three';

const NODE_COLORS = ['#3b82f6', '#22d3ee', '#60a5fa', '#818cf8', '#06b6d4'];
const SPHERE_RADIUS = 1.8;
const N_NODES = 28;
const CONNECT_THRESHOLD = SPHERE_RADIUS * 1.12;

// Hub: nodes with degree >= this get a larger/brighter treatment
const HUB_DEGREE = 4;

function buildNetwork() {
  const phi = Math.PI * (3 - Math.sqrt(5));
  const nodes = Array.from({ length: N_NODES }, (_, i) => {
    const y = 1 - (i / (N_NODES - 1)) * 2;
    const r = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = phi * i;
    return {
      position: new THREE.Vector3(r * Math.cos(theta), y, r * Math.sin(theta))
        .multiplyScalar(SPHERE_RADIUS),
      color: NODE_COLORS[i % NODE_COLORS.length],
      speed: 0.5 + (i % 7) * 0.22,
      phase: (i * 0.618) * Math.PI * 2,
      degree: 0,
    };
  });

  const edges = [];
  for (let i = 0; i < N_NODES; i++) {
    for (let j = i + 1; j < N_NODES; j++) {
      if (nodes[i].position.distanceTo(nodes[j].position) < CONNECT_THRESHOLD) {
        edges.push({
          a: nodes[i].position.toArray(),
          b: nodes[j].position.toArray(),
          aIdx: i,
          bIdx: j,
          phase: (i + j * 0.5) * 0.8,
          speed: 0.6 + ((i + j) % 5) * 0.15,
        });
        nodes[i].degree++;
        nodes[j].degree++;
      }
    }
  }

  // Mark hubs
  nodes.forEach(n => { n.isHub = n.degree >= HUB_DEGREE; });

  // Pick edges with at least one hub endpoint for packet travel
  const packetEdges = edges.filter(e => nodes[e.aIdx].isHub || nodes[e.bIdx].isHub).slice(0, 6);

  return { nodes, edges, packetEdges };
}

// A small glowing sphere that travels along an edge
function DataPacket({ from, to, speed, color }) {
  const meshRef = useRef();
  const start = useMemo(() => new THREE.Vector3(...from), []);
  const end   = useMemo(() => new THREE.Vector3(...to),   []);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = ((clock.getElapsedTime() * speed) % 1 + 1) % 1;
    meshRef.current.position.lerpVectors(start, end, t);
    meshRef.current.material.opacity = Math.sin(t * Math.PI) * 0.9;
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.05, 8, 8]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={5}
        transparent
        opacity={0}
        depthWrite={false}
      />
    </mesh>
  );
}

function NetworkSphere() {
  const groupRef = useRef();
  const nodeRefs = useRef([]);
  const lineRefs = useRef([]);

  const { nodes, edges, packetEdges } = useMemo(() => buildNetwork(), []);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();
    groupRef.current.rotation.y = t * 0.07;
    groupRef.current.rotation.x = Math.sin(t * 0.18) * 0.1;

    nodeRefs.current.forEach((mesh, i) => {
      if (!mesh?.material) return;
      const node = nodes[i];
      const base = node.isHub ? 1.5 : 0.4;
      const amp  = node.isHub ? 2.2 : 1.5;
      mesh.material.emissiveIntensity = base + amp * Math.max(0, Math.sin(t * node.speed + node.phase));
    });

    lineRefs.current.forEach((line, i) => {
      if (!line?.material) return;
      const e = edges[i];
      const v = 0.06 + 0.3 * Math.max(0, Math.sin(t * e.speed + e.phase));
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
          lineWidth={0.7}
          transparent
          opacity={0.12}
        />
      ))}

      {nodes.map((node, i) => (
        <mesh
          key={i}
          ref={el => { nodeRefs.current[i] = el; }}
          position={node.position}
        >
          <sphereGeometry args={[node.isHub ? 0.12 : 0.065, 14, 14]} />
          <meshStandardMaterial
            color={node.color}
            emissive={node.color}
            emissiveIntensity={node.isHub ? 2.5 : 1.0}
          />
        </mesh>
      ))}

      {/* Data packets travelling along hub edges */}
      {packetEdges.map((e, i) => (
        <DataPacket
          key={`p-${i}`}
          from={e.a}
          to={e.b}
          speed={0.4 + i * 0.12}
          color={NODE_COLORS[i % NODE_COLORS.length]}
        />
      ))}
    </group>
  );
}

export function AgentArtifact() {
  return (
    <div className="w-full h-64 md:h-80">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        dpr={[1, 2]}
        gl={{ toneMappingExposure: 1.4, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.3} />
        <pointLight position={[4, 4, 4]} intensity={5} color="#60a5fa" />
        <pointLight position={[-3, -3, 3]} intensity={4} color="#22d3ee" />
        <pointLight position={[0, 3, 2]} intensity={2.5} color="#818cf8" />
        <Environment preset="city" />
        <NetworkSphere />
      </Canvas>
    </div>
  );
}
