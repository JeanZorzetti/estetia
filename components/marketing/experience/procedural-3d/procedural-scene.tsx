'use client'

import { useRef, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, MeshDistortMaterial } from '@react-three/drei'
import * as THREE from 'three'

function IridescentSphere({ scrollProgress }: { scrollProgress: React.MutableRefObject<number> }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const outerRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (!meshRef.current || !outerRef.current) return
    const t = state.clock.elapsedTime
    const p = scrollProgress.current

    meshRef.current.rotation.y = t * 0.2 + p * Math.PI * 2
    meshRef.current.rotation.x = Math.sin(t * 0.15) * 0.4 + p * 0.5
    meshRef.current.rotation.z = Math.cos(t * 0.1) * 0.2

    const scale = 1.0 + p * 0.4
    meshRef.current.scale.setScalar(scale)

    outerRef.current.rotation.y = -t * 0.1
    outerRef.current.rotation.z = t * 0.07
  })

  return (
    <group>
      <mesh ref={outerRef}>
        <torusKnotGeometry args={[1.4, 0.06, 200, 16, 2, 3]} />
        <meshPhysicalMaterial
          color="#489FB5"
          emissive="#1A4F5C"
          emissiveIntensity={0.6}
          metalness={0.85}
          roughness={0.15}
          transparent
          opacity={0.85}
        />
      </mesh>

      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1, 4]} />
        <MeshDistortMaterial
          color="#C5A059"
          emissive="#8B6E32"
          emissiveIntensity={0.5}
          metalness={0.7}
          roughness={0.15}
          distort={0.3}
          speed={2}
          iridescence={1}
          iridescenceIOR={1.8}
          iridescenceThicknessRange={[100, 800]}
          envMapIntensity={1}
        />
      </mesh>

      {[1.8, 2.3, 2.9].map((r, i) => (
        <mesh key={i} rotation={[Math.PI / (i + 2), 0, i * 0.7]}>
          <torusGeometry args={[r, 0.012, 8, 80]} />
          <meshBasicMaterial
            color={i === 0 ? '#C5A059' : '#489FB5'}
            transparent
            opacity={0.15 - i * 0.04}
          />
        </mesh>
      ))}
    </group>
  )
}

interface SceneProps {
  externalProgress?: number
}

function SceneContent({ externalProgress }: SceneProps) {
  const scrollProgress = useRef(externalProgress ?? 0)

  useEffect(() => {
    scrollProgress.current = externalProgress ?? 0
  }, [externalProgress])

  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[5, 5, 5]} intensity={3} color="#C5A059" />
      <pointLight position={[-5, -3, -5]} intensity={2} color="#489FB5" />
      <pointLight position={[0, 8, -3]} intensity={1.5} color="#F0EDE8" />
      <pointLight position={[3, -5, 4]} intensity={1.2} color="#E3C97C" />
      <directionalLight position={[2, 4, 6]} intensity={0.8} color="#FFFFFF" />
      <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.5}>
        <IridescentSphere scrollProgress={scrollProgress} />
      </Float>
    </>
  )
}

export default function ProceduralScene({ externalProgress }: SceneProps = {}) {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <SceneContent externalProgress={externalProgress} />
      </Canvas>
    </div>
  )
}
