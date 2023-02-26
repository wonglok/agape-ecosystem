import { Environment, MeshTransmissionMaterial, OrbitControls, Select, Sphere, Stars } from '@react-three/drei'
import { Canvas, useThree } from '@react-three/fiber'
import { Suspense } from 'react'
import { RunnerObject } from './RunnerObject/RunnerObject'
import { useFlow } from '../useFlow/useFlow'
import { Env, HomeTrim } from '@/components/content/HomeTrim/HomeTrim'
import { Bloom, EffectComposer } from '@react-three/postprocessing'
import { Color } from 'three'
import path from 'path'
import md5 from 'md5'

export function FlowSystemRunner() {
  return (
    <div className='relative w-full h-full'>
      <Canvas>
        <Suspense fallback={null}>
          <Content></Content>
        </Suspense>
      </Canvas>
      <div className='absolute top-0 right-0'>
        <button
          className='w-full p-2 my-2 text-black bg-gray-200'
          onClick={() => {
            //
            let input = document.createElement('input')
            input.type = 'file'

            input.onchange = ({
              target: {
                files: [first],
              },
            }) => {
              if (first) {
                let fd = new FormData()
                fd.set('file', first)
                fd.set('fileName', `file-${md5(first.name + first.type)}${path.extname(first.name)}`)
                fd.set('contentType', first.type + '')

                fetch(`/api/test-upload-glb`, {
                  method: 'POST',
                  body: fd,
                })
                  .then((r) => r.json())
                  .then(async (r) => {
                    console.log(r)

                    let defaultItem = localStorage.getItem('defaultItem')

                    if (defaultItem !== '' || defaultItem !== null) {
                      await fetch(`/api/test-upload`, {
                        method: 'POST',
                        body: JSON.stringify({
                          method: 'delete',
                          url: defaultItem,
                        }),
                      })
                        .then((r) => r.json())
                        .then((r) => {
                          console.log(r)
                        })
                    }

                    localStorage.setItem('defaultItem', r)

                    window.dispatchEvent(new CustomEvent('loadGLB', { detail: r }))
                  })

                // let reader = new FileReader()
                // reader.onload = () => {
                //   let dataURL = reader.result.replace(`base64,`, `_______B64_________`)
                //   let fileData = dataURL.split('_______B64_________').pop()

                //   console.log(fileData)

                //   /*
                //   JSON.stringify({
                //       method: 'upload',
                //       fileData: fileData,
                //       fileName: `file-${md5(fileData)}${path.extname(first.name)}`,
                //       contentType: first.type,
                //     })
                //     */
                // }
                // reader.readAsDataURL(first)
              }
            }
            input.click()
          }}>
          Select URL
        </button>
      </div>
    </div>
  )
}

function Content() {
  return (
    <>
      {/* Demo */}
      <pointLight intensity={0.5} color={'white'} position={[1, 1, 0]}>
        <Sphere scale={0.05} visible={false}></Sphere>
      </pointLight>

      <pointLight intensity={0.5} color={'teal'} position={[0, -0.3, 0]}>
        <Sphere scale={0.05} visible={false}></Sphere>
      </pointLight>
      <pointLight intensity={0.5} color={'white'} position={[-1, 1, 0]}>
        <Sphere scale={0.05} visible={false}></Sphere>
      </pointLight>

      {/* <Env></Env> */}
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

      {/* <Environment preset='night'></Environment> */}
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
