import { useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Icosahedron, MeshDistortMaterial, Environment } from '@react-three/drei';

function Crystal() {
  const meshRef = useRef();
  const { pointer } = useThree();

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();
    meshRef.current.rotation.x += 0.003;
    meshRef.current.rotation.y += 0.005;
    meshRef.current.rotation.x += (pointer.y * 0.3 - meshRef.current.rotation.x) * 0.02;
    meshRef.current.rotation.y += (pointer.x * 0.3 - meshRef.current.rotation.y) * 0.02;
    meshRef.current.position.y = Math.sin(t * 0.5) * 0.12;
  });

  return (
    <Icosahedron ref={meshRef} args={[1.6, 1]}>
      <MeshDistortMaterial
        color="#60a5fa"
        distort={0.25}
        speed={1.5}
        roughness={0.05}
        metalness={0.9}
        transparent
        opacity={0.92}
        emissive="#3b82f6"
        emissiveIntensity={1.2}
      />
    </Icosahedron>
  );
}

export function ExpertArtifact() {
  return (
    <div className="w-full h-64 md:h-96">
      <Canvas
        camera={{ position: [0, 0, 4.5], fov: 45 }}
        dpr={[1, 2]}
        gl={{ toneMappingExposure: 1.4 }}
      >
        <ambientLight intensity={0.2} />
        <pointLight position={[3, 3, 3]} intensity={4} color="#60a5fa" />
        <pointLight position={[-3, -2, 2]} intensity={3} color="#22d3ee" />
        <pointLight position={[0, 0, 2]} intensity={2} color="#93c5fd" />
        <Environment preset="city" />
        <Crystal />
      </Canvas>
    </div>
  );
}
