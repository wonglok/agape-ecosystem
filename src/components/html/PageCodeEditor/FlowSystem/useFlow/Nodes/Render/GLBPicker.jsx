/* eslint-disable @next/next/no-img-element */
import React, { useRef, useState } from 'react'
import { Handle, Position } from 'reactflow'
import { useFlow } from '../../useFlow'
// import { InputNumber, Slider } from 'antd'
import { ExposeParamter } from '../../SharedGUI/ExposeParamter'
import { makeHoverStateSource, makeHoverStateTarget } from '../../SharedGUI/HoverState'
// import { TextureLoader } from 'three' // Texture,
import { Switch } from 'antd'
import md5 from 'md5'
import path from 'path'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { Object3D } from 'three'
import { MyGLTFLoader } from '@/components/content/HomeTrim/MyGLTFLoader'

export const handles = [
  //
  { type: 'source', dataType: 'object3d', id: 'glbScene', displayName: 'GLB Scene' },
  { type: 'source', dataType: 'animations', id: 'glbAnimations', displayName: 'Animations' },
]

export const name = 'GLBPicker'

export const createData = () => {
  return {
    type: name,
    data: { label: 'glbPicker1', glbFileURL: '', flipY: false },
    position: { x: 0, y: 0 },
  }
}

export default function GUI({ id, data, selected }) {
  // const updateNodeData = useFlow((s) => s.updateNodeData)
  const updateNodeLabel = useFlow((s) => s.updateNodeLabel)
  return (
    <div
      className={`text-sm rounded-xl transition-transform duration-300 scale-100  border bg-white ${
        selected ? ' border-cyan-500 shadow-cyan-100 shadow-lg ' : ' border-transparent'
      }`}>
      {handles
        .filter((r) => r.type === 'target')
        .map((r, i) => {
          return (
            <Handle
              type={r.type}
              id={r.id}
              key={r.id}
              {...makeHoverStateTarget({ handle: r })}
              className='w-2 h-4 bg-gray-400 rounded-full'
              style={{ top: `calc(10px + 20px * ${i})` }}
              position={Position.Left}
            />
          )
        })}
      <div className='flex items-center justify-center'>
        {/*  */}
        {/*  */}
        <div
          style={{ backgroundColor: selected ? '#7298ff' : '#a0a0a0' }}
          className='flex items-center justify-center w-12 h-10 bg-transparent  rounded-tl-xl'>
          <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'>
            <path
              fill='white'
              d='M24 7v-2c0-2.761-2.238-5-5-5h-14c-2.761 0-5 2.239-5 5v2h10v2h-10v6h4v2h-4v2c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-2h-8v-2h8v-6h-5v-2h5zm-16 11c0 .552-.447 1-1 1s-1-.448-1-1v-4c0-.552.447-1 1-1s1 .448 1 1v4zm3 0c0 .552-.447 1-1 1s-1-.448-1-1v-4c0-.552.447-1 1-1s1 .448 1 1v4zm3 0c0 .552-.447 1-1 1s-1-.448-1-1v-4c0-.552.447-1 1-1s1 .448 1 1v4zm0-8c0 .552-.447 1-1 1s-1-.448-1-1v-4c0-.552.447-1 1-1s1 .448 1 1v4zm3 0c0 .552-.447 1-1 1s-1-.448-1-1v-4c0-.552.447-1 1-1s1 .448 1 1v4z'
            />
          </svg>
        </div>

        <input
          type='text'
          defaultValue={data.label}
          onChange={(evt) => updateNodeLabel(id, evt.target.value)}
          className='w-full h-10 pl-2 text-xs bg-gray-100 appearance-none rounded-r-xl nodrag'
        />

        <ExposeParamter id={id} data={data}></ExposeParamter>

        {/* <input
          type='color'
          defaultValue={data.color}
          onChange={(evt) => updateNodeColor(id, evt.target.value)}
          className='h-10 text-xs opacity-0'
        /> */}
      </div>

      <div className='px-3 pt-0 pb-3'>
        <SettingsGUI data={data} id={id}></SettingsGUI>
      </div>

      {handles
        .filter((r) => r.type === 'source')
        .map((r, i) => {
          return (
            <Handle
              {...makeHoverStateSource({ handle: r })}
              type={r.type}
              id={r.id}
              key={r.id}
              className='w-2 h-4 bg-gray-400 rounded-full'
              style={{ top: `calc(20px + 20px * ${i})` }}
              position={Position.Right}
            />
          )
        })}
    </div>
  )
}

export function writeSettings({ node, input }) {
  node.data.glbObject = input
}
export function readSettings({ node }) {
  return node.data.glbObject
}

export const SettingsGUI = ({ data, id }) => {
  let updateNodeData = useFlow((r) => r.updateNodeData)
  return (
    <>
      <div className='nodrag'>
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
                    //
                    console.log(r)

                    updateNodeData(id, 'glbFileURL', r)

                    // if (defaultItem !== '' || defaultItem !== null) {

                    // }
                  })
              }
            }
            input.click()
          }}>
          Select GLB
        </button>
      </div>

      {/* <div className='flex items-center mb-3'>
        FlipY
        <Switch
          className='ml-3 bg-gray-200'
          defaultChecked={data.flipY || false}
          onChange={(ev) => {
            updateNodeData(id, 'flipY', ev)
          }}></Switch>
      </div> */}

      <div>
        {(data.glbFileURL && (
          <>
            <button
              className='p-3 bg-gray-300'
              onClick={() => {
                //

                fetch(`/api/test-upload`, {
                  method: 'POST',
                  body: JSON.stringify({
                    method: 'delete',
                    url: data.glbFileURL,
                  }),
                })
                  .then((r) => {
                    return r.json()
                  })
                  .then(
                    () => {
                      updateNodeData(id, 'glbFileURL', false)
                    },
                    () => {
                      updateNodeData(id, 'glbFileURL', false)
                    },
                  )
              }}>
              Remove
            </button>
          </>
        )) ||
          ''}
      </div>
      {/*  */}
    </>
  )
}

let blobProms = new Map()
let provideBlobPromise = (url) => {
  if (blobProms.has(url)) {
    return blobProms.get(url)
  } else {
    blobProms.set(
      url,
      new Promise(async (resolve) => {
        let blobYo = await fetch(url, {
          mode: 'cors',
        }).then((r) => r.blob())
        resolve(URL.createObjectURL(blobYo))
      }),
    )

    return blobProms.get(url)
  }
}

export const run = async ({ setCompos, core, globals, getNode, send, on }) => {
  let o3 = new Object3D()
  core.now.scene.add(o3)

  core.onPreload(() => {
    //
  })
  core.onReady(() => {
    let last = ''
    let tt = setInterval(() => {
      let node = getNode()
      let now = JSON.stringify(node.data)
      if (last !== now) {
        last = now

        if (node?.data?.glbFileURL) {
          let loader = new MyGLTFLoader()
          let draco = new DRACOLoader()
          draco.setDecoderPath(`/draco/`)
          loader.setDRACOLoader(draco)

          provideBlobPromise(node?.data?.glbFileURL).then((url) => {
            loader.loadAsync(url).then((v) => {
              o3.clear()
              o3.add(v.scene)
              // setCompos(<primitive object={v.scene}></primitive>)
            })
          })

          // new TextureLoader().loadAsync(node?.data?.glbFileURL).then((v) => {
          //   v.flipY = getNode().data.flipY || false
          //   v.needsUpdate = true
          //   send('glbObject', v)
          // })
        } else {
          // send(
          //   'glbObject',
          //   new TextureLoader().load(
          //     `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=`,
          //   ),
          // )
        }
      }
    })

    window.addEventListener('needsUpdate', () => {
      let node = getNode()
      if (node?.data?.glbFileURL) {
        // new TextureLoader().loadAsync(node?.data?.glbFileURL).then((v) => {
        //   v.flipY = getNode().data.flipY || false
        //   v.needsUpdate = true
        //   send('glbObject', v)
        // })
      } else {
        // send(
        //   'glbObject',
        //   new TextureLoader().load(
        //     `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=`,
        //   ),
        // )
      }
    })

    globals.onClean(() => {
      o3.removeFromParent()
      clearInterval(tt)
    })
  })
}
