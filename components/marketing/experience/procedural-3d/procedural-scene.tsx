'use client'

import { useRef, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Environment, Float, MeshDistortMaterial } from '@react-three/drei'
import * as THREE from 'three'
import { gsap, ScrollTrigger, registerGsap } from '@/lib/animation/gsap'

function IridescentSphere({ scrollProgress }: { scrollProgress: React.MutableRefObject<number> }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const outerRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (!meshRef.current || !outerRef.current) return
    const t = state.clock.elapsedTime
    const p = scrollProgress.current

    // Rotação baseada no scroll + idle rotation
    meshRef.current.rotation.y = t * 0.2 + p * Math.PI * 2
    meshRef.current.rotation.x = Math.sin(t * 0.15) * 0.4 + p * 0.5
    meshRef.current.rotation.z = Math.cos(t * 0.1) * 0.2

    // Escala ao scroll
    const scale = 1.0 + p * 0.4
    meshRef.current.scale.setScalar(scale)

    outerRef.current.rotation.y = -t * 0.1
    outerRef.current.rotation.z = t * 0.07
  })

  return (
    <group>
      {/* Anel externo */}
      <mesh ref={outerRef}>
        <torusKnotGeometry args={[1.4, 0.06, 200, 16, 2, 3]} />
        <meshPhysicalMaterial
          color="#489FB5"
          emissive="#1A4F5C"
          emissiveIntensity={0.4}
          metalness={0.9}
          roughness={0.1}
          transmission={0.3}
          thickness={0.5}
          transparent
          opacity={0.7}
        />
      </mesh>

      {/* Esfera iridescente central */}
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1, 4]} />
        <MeshDistortMaterial
          color="#C5A059"
          emissive="#5C3B00"
          emissiveIntensity={0.3}
          metalness={0.95}
          roughness={0.05}
          distort={0.3}
          speed={2}
          iridescence={1}
          iridescenceIOR={1.8}
          iridescenceThicknessRange={[100, 800]}
          envMapIntensity={2}
        />
      </mesh>

      {/* Anéis de fundo */}
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

function ScrollWatcher({ onScroll }: { onScroll: (p: number) => void }) {
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    registerGsap()
    const section = document.getElementById('procedural-3d-trigger')
    if (!section) return

    const st = ScrollTrigger.create({
      trigger: section,
      start: 'top center',
      end: 'bottom center',
      onUpdate: (self) => onScroll(self.progress),
    })

    return () => st.kill()
  }, [onScroll])

  return null
}

function SceneContent() {
  const scrollProgress = useRef(0)

  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[5, 5, 5]} intensity={2} color="#C5A059" />
      <pointLight position={[-5, -3, -5]} intensity={1.5} color="#489FB5" />
      <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.5}>
        <IridescentSphere scrollProgress={scrollProgress} />
      </Float>
      <Environment preset="city" />
      <ScrollWatcher onScroll={(p) => { scrollProgress.current = p }} />
    </>
  )
}

export default function ProceduralScene() {
  return (
    <div id="procedural-3d-trigger" className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <SceneContent />
      </Canvas>
    </div>
  )
}
