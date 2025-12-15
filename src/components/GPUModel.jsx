import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stage, PerspectiveCamera, Environment } from '@react-three/drei';

function GPU(props) {
    const group = useRef();
    const fan1 = useRef();
    const fan2 = useRef();
    const fan3 = useRef();

    useFrame((state, delta) => {
        // Rotate fans
        if (fan1.current) fan1.current.rotation.z -= delta * 5;
        if (fan2.current) fan2.current.rotation.z -= delta * 5;
        if (fan3.current) fan3.current.rotation.z -= delta * 5;

        // Gentle floating
        if (group.current) {
            group.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1;
            group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
        }
    });

    return (
        <group ref={group} {...props} dispose={null}>
            {/* PCB / Backplate - Lighter Grey */}
            <mesh position={[0, 0, -0.25]}>
                <boxGeometry args={[4, 1.5, 0.1]} />
                <meshStandardMaterial color="#404040" metalness={0.8} roughness={0.2} />
            </mesh>

            {/* Main Shroud Body - Lighter Grey */}
            <mesh position={[0, 0, 0]}>
                <boxGeometry args={[3.8, 1.4, 0.4]} />
                <meshStandardMaterial color="#606060" metalness={0.5} roughness={0.5} />
            </mesh>

            {/* LED Strip (Cyberpunk style) */}
            <mesh position={[0, 0.7, 0.2]}>
                <boxGeometry args={[3.8, 0.05, 0.05]} />
                <meshStandardMaterial color="#00f5ff" emissive="#00f5ff" emissiveIntensity={3} />
            </mesh>

            {/* Accent Lines */}
            <mesh position={[-1.5, -0.6, 0.2]}>
                <boxGeometry args={[0.5, 0.05, 0.05]} />
                <meshStandardMaterial color="#ff00aa" emissive="#ff00aa" emissiveIntensity={3} />
            </mesh>
            <mesh position={[1.5, 0.6, 0.2]}>
                <boxGeometry args={[0.5, 0.05, 0.05]} />
                <meshStandardMaterial color="#ff00aa" emissive="#ff00aa" emissiveIntensity={3} />
            </mesh>

            {/* Fan 1 */}
            <group position={[-1.2, 0, 0.21]} ref={fan1}>
                <mesh rotation={[Math.PI / 2, 0, 0]}>
                    <cylinderGeometry args={[0.5, 0.5, 0.05, 32]} />
                    <meshStandardMaterial color="#202020" />
                </mesh>
                {/* Fan Blades */}
                <mesh rotation={[Math.PI / 2, 0, 0]}>
                    <boxGeometry args={[0.1, 0.9, 0.06]} />
                    <meshStandardMaterial color="#444" />
                </mesh>
                <mesh rotation={[Math.PI / 2, 0, Math.PI / 2]}>
                    <boxGeometry args={[0.1, 0.9, 0.06]} />
                    <meshStandardMaterial color="#444" />
                </mesh>
                <mesh rotation={[0, 0, 0]}>
                    <cylinderGeometry args={[0.1, 0.1, 0.08, 16]} />
                    <meshStandardMaterial color="#00f5ff" emissive="#00f5ff" emissiveIntensity={1} />
                </mesh>
            </group>

            {/* Fan 2 */}
            <group position={[0, 0, 0.21]} ref={fan2}>
                <mesh rotation={[Math.PI / 2, 0, 0]}>
                    <cylinderGeometry args={[0.5, 0.5, 0.05, 32]} />
                    <meshStandardMaterial color="#202020" />
                </mesh>
                <mesh rotation={[Math.PI / 2, 0, 0]}>
                    <boxGeometry args={[0.1, 0.9, 0.06]} />
                    <meshStandardMaterial color="#444" />
                </mesh>
                <mesh rotation={[Math.PI / 2, 0, Math.PI / 2]}>
                    <boxGeometry args={[0.1, 0.9, 0.06]} />
                    <meshStandardMaterial color="#444" />
                </mesh>
                <mesh rotation={[0, 0, 0]}>
                    <cylinderGeometry args={[0.1, 0.1, 0.08, 16]} />
                    <meshStandardMaterial color="#00f5ff" emissive="#00f5ff" emissiveIntensity={1} />
                </mesh>
            </group>

            {/* Fan 3 */}
            <group position={[1.2, 0, 0.21]} ref={fan3}>
                <mesh rotation={[Math.PI / 2, 0, 0]}>
                    <cylinderGeometry args={[0.5, 0.5, 0.05, 32]} />
                    <meshStandardMaterial color="#202020" />
                </mesh>
                <mesh rotation={[Math.PI / 2, 0, 0]}>
                    <boxGeometry args={[0.1, 0.9, 0.06]} />
                    <meshStandardMaterial color="#444" />
                </mesh>
                <mesh rotation={[Math.PI / 2, 0, Math.PI / 2]}>
                    <boxGeometry args={[0.1, 0.9, 0.06]} />
                    <meshStandardMaterial color="#444" />
                </mesh>
                <mesh rotation={[0, 0, 0]}>
                    <cylinderGeometry args={[0.1, 0.1, 0.08, 16]} />
                    <meshStandardMaterial color="#00f5ff" emissive="#00f5ff" emissiveIntensity={1} />
                </mesh>
            </group>
        </group>
    );
}

export default function GPUModel() {
    return (
        <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 0, 2.8], fov: 40 }}>
            {/* Lighting - Brightened Up */}
            <ambientLight intensity={2.0} />
            <pointLight position={[10, 10, 10]} intensity={3.0} />
            <pointLight position={[-10, 5, 10]} intensity={2.0} color="#00f5ff" />
            <spotLight position={[0, 5, 5]} intensity={5.0} angle={0.5} penumbra={1} />

            {/* Environment for reflections */}
            <Environment preset="studio" />

            {/* The Model - Stage auto-fit disabled for manual sizing */}
            <Stage environment={null} intensity={1.0} castShadow={false} adjustCamera={false}>
                <GPU />
            </Stage>

            {/* Controls - Zoom enabled if user wants even closer */}
            <OrbitControls autoRotate autoRotateSpeed={4} enableZoom={true} minDistance={1.5} maxDistance={10} />
        </Canvas>
    );
}
