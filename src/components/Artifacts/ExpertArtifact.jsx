import { useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Icosahedron, MeshDistortMaterial, Environment } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';

function Crystal() {
  const meshRef = useRef();
  const { pointer } = useThree();

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();
    // Base rotation
    meshRef.current.rotation.x += 0.003;
    meshRef.current.rotation.y += 0.005;
    // Subtle mouse-following tilt
    meshRef.current.rotation.x += (pointer.y * 0.3 - meshRef.current.rotation.x) * 0.02;
    meshRef.current.rotation.y += (pointer.x * 0.3 - meshRef.current.rotation.y) * 0.02;
    // Gentle float
    meshRef.current.position.y = Math.sin(t * 0.5) * 0.12;
  });

  return (
    <Icosahedron ref={meshRef} args={[1.6, 1]}>
      <MeshDistortMaterial
        color="#3b82f6"
        distort={0.25}
        speed={1.5}
        roughness={0.05}
        metalness={0.9}
        transparent
        opacity={0.92}
        emissive="#1d4ed8"
        emissiveIntensity={0.4}
      />
    </Icosahedron>
  );
}

export function ExpertArtifact() {
  const isDark = document.documentElement.classList.contains('dark');
  return (
    <div className="w-full h-64 md:h-96">
      <Canvas camera={{ position: [0, 0, 4.5], fov: 45 }} dpr={[1, 2]}>
        <ambientLight intensity={0.3} />
        <pointLight position={[4, 4, 4]} intensity={2} color="#60a5fa" />
        <pointLight position={[-4, -2, 2]} intensity={1} color="#22d3ee" />
        <Environment preset="city" />
        <Crystal />
        <EffectComposer>
          <Bloom
            luminanceThreshold={0.3}
            luminanceSmoothing={0.9}
            intensity={isDark ? 1.8 : 0.8}
            radius={0.8}
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
