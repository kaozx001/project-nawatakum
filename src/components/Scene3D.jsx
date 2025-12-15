import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';

function StarField(props) {
    const ref = useRef();

    const sphere = useMemo(() => {
        const temp = new Float32Array(5000 * 3);
        for (let i = 0; i < 5000; i++) {
            const theta = 2 * Math.PI * Math.random();
            const phi = Math.acos(2 * Math.random() - 1);
            const r = 1.2 + Math.random() * 0.8; // Radius between 1.2 and 2

            const x = r * Math.sin(phi) * Math.cos(theta);
            const y = r * Math.sin(phi) * Math.sin(theta);
            const z = r * Math.cos(phi);

            temp[i * 3] = x;
            temp[i * 3 + 1] = y;
            temp[i * 3 + 2] = z;
        }
        return temp;
    }, []);

    useFrame((state, delta) => {
        ref.current.rotation.x -= delta / 10;
        ref.current.rotation.y -= delta / 15;
    });

    return (
        <group rotation={[0, 0, Math.PI / 4]}>
            <Points ref={ref} positions={sphere} stride={3} frustumCulled={false} {...props}>
                <PointMaterial
                    transparent
                    color="#00f5ff"
                    size={0.002}
                    sizeAttenuation={true}
                    depthWrite={false}
                    opacity={0.6}
                />
            </Points>
        </group>
    );
}

function GridFloor() {
    return (
        <gridHelper
            args={[20, 20, 0x00f5ff, 0x222222]}
            position={[0, -1, 0]}
            rotation={[0, 0, 0]}
        />
    );
}

export default function Scene3D({ variant = 'stars' }) {
    return (
        <div className="canvas-container" style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 0,
            pointerEvents: 'none',
            opacity: 0.4
        }}>
            <Canvas camera={{ position: [0, 0, 1] }}>
                {variant === 'stars' && <StarField />}
                {variant === 'grid' && (
                    <>
                        <StarField />
                        {/* <GridFloor /> */}
                    </>
                )}
            </Canvas>
        </div>
    );
}
