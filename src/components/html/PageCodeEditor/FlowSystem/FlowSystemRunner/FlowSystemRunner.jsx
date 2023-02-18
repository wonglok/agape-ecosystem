import { Environment, MeshTransmissionMaterial, OrbitControls, Select, Stars } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'

export function FlowSystemRunner() {
  return (
    <div className='w-full h-full'>
      <Canvas>
        <Suspense fallback={null}>
          <Content></Content>
        </Suspense>
      </Canvas>
    </div>
  )
}

function Content() {
  return (
    <>
      <mesh scale={[1, 1, 1]}>
        <torusBufferGeometry args={[2.5, 1, 64, 64]}></torusBufferGeometry>
        <meshPhysicalMaterial roughness={0.0} transmission={1} thickness={1.5}></meshPhysicalMaterial>
      </mesh>

      <Environment preset='sunset' background></Environment>
      <OrbitControls dampingFactor={1} enableDamping object-position={[0.0, 2.5, 8]}></OrbitControls>

      <gridHelper args={[100, 100, 0xffffff, 0xffffff]}></gridHelper>
    </>
  )
}
