import { Environment, MeshTransmissionMaterial, OrbitControls, Select, Stars } from '@react-three/drei'
import { Canvas, useThree } from '@react-three/fiber'
import { Suspense } from 'react'
import { RunnerObject } from './RunnerObject/RunnerObject'
import { useFlow } from '../useFlow/useFlow'
import { HomeTrim } from '@/components/content/HomeTrim/HomeTrim'
import { Bloom, EffectComposer } from '@react-three/postprocessing'
import { Color } from 'three'

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
      {/* Demo */}
      <pointLight color={'white'} position={[1, 2, 0]}></pointLight>
      <pointLight color={'white'} position={[-1, 2, 0]}></pointLight>

      <HomeTrim></HomeTrim>
      <Convo></Convo>
      <BG></BG>
      <EffectComposer disableNormalPass={false}>
        <Bloom luminanceThreshold={0.7} intensity={3} radius={0.8} mipmapBlur></Bloom>
      </EffectComposer>

      {/* <mesh scale={[1, 1, 1]}>
        <torusBufferGeometry args={[2.5, 1, 64, 64]}></torusBufferGeometry>
        <meshPhysicalMaterial roughness={0.0} transmission={1} thickness={1.5}></meshPhysicalMaterial>
      </mesh> */}

      <Environment preset='night'></Environment>
      <OrbitControls dampingFactor={1} enableDamping object-position={[0.0, 2.5, 8]}></OrbitControls>

      {/* <gridHelper args={[100, 100, 0xffffff, 0xffffff]}></gridHelper> */}
    </>
  )
}

//
function BG() {
  let scene = useThree((r) => r.scene)
  scene.background = new Color('#000000')
  return null
}

//
function Convo() {
  let nodes = useFlow((s) => s.nodes)
  let edges = useFlow((s) => s.edges)

  return (
    <>
      <RunnerObject key={edges.map((r) => r.id).join('_')} nodes={nodes} edges={edges}></RunnerObject>
    </>
  )
}
