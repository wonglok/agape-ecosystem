import { Center, Html, useGLTF } from '@react-three/drei'
import { useLoader } from '@react-three/fiber'
import { MyGLTFLoader } from './MyGLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { Environment, Lightformer } from '@react-three/drei'
import { Vector3 } from 'three'
import { useEffect, useState } from 'react'

export function HomeTrim() {
  let [st, setST] = useState(`/date/2022-20-24-mech/ball-4k-webp-each2k.glb`)
  useEffect(() => {
    let hh = ({ detail }) => {
      setST(detail)
    }
    window.addEventListener('loadGLB', hh)
    return () => {
      window.removeEventListener('loadGLB', hh)
    }
  }, [])

  useEffect(() => {
    let defaultItem = localStorage.getItem('defaultItem')

    if (defaultItem !== '' || defaultItem !== null) {
      setST(defaultItem)
    }
  }, [])

  // let gltf = useGLTF(`/date/2022-20-23/UnityVFXRoom.glb`)
  let gltf = useLoader(MyGLTFLoader, st, (loader) => {
    let draco = new DRACOLoader()
    draco.setDecoderPath(`/draco/`)
    loader.setDRACOLoader(draco)
  })

  useEffect(() => {
    window.dispatchEvent(new CustomEvent('needsUpdate', { detail: {} }))

    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('needsUpdate', { detail: {} }))
    })
  }, [gltf])

  let [html, setHTML] = useState('')
  return (
    <>
      {html && <Html className='bg-white'>{html}</Html>}
      <group
        onPointerOver={(ev) => {
          setHTML(ev?.object?.name)
        }}>
        <Center>
          <primitive object={gltf.scene}></primitive>
        </Center>
      </group>
    </>
  )
}
