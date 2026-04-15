import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { TorusKnot } from '@react-three/drei';

function Ribbon({ color, position, speed }) {
  const meshRef = useRef();
  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x = state.clock.getElapsedTime() * speed;
    meshRef.current.rotation.y = state.clock.getElapsedTime() * speed * 0.7;
  });
  return (
    <TorusKnot ref={meshRef} args={[0.8, 0.15, 64, 12]} position={position}>
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.4} metalness={0.6} roughness={0.2} transparent opacity={0.85} />
    </TorusKnot>
  );
}

export function MultimodalArtifact() {
  return (
    <div className="w-full h-64 md:h-96">
      <Canvas camera={{ position: [0, 0, 5] }} dpr={[1, 1.5]}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <Ribbon color="#2563eb" position={[-1.2, 0.5, 0]} speed={0.2} />
        <Ribbon color="#06b6d4" position={[1.2, -0.5, 0]} speed={0.25} />
        <Ribbon color="#3b82f6" position={[0, 0, 0.5]} speed={0.15} />
      </Canvas>
    </div>
  );
}
