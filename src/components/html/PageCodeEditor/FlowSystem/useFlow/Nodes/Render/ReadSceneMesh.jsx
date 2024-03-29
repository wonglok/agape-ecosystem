import React, { useRef } from 'react'
import { Handle, Position } from 'reactflow'
import { useFlow } from '../../useFlow'
import { getTemplateByNodeInstance } from '../../nodeTypes'
import { MeshPhysicalMaterial } from 'three'

//BoxGeometry, Mesh,
// import { ExposeParamter } from '../../SharedGUI/ExposeParamter'
import { makeHoverStateTarget } from '../../SharedGUI/HoverState'

export const handles = [
  //
  { type: 'target', dataType: 'material', id: 'material', displayName: 'Material' },
  { type: 'target', dataType: 'geometry', id: 'geometry', displayName: 'Geometry' },
  { type: 'source', dataType: 'object3d', id: 'object3d', displayName: 'Object3D' },
]

export const name = 'ReadSceneMesh'

export const createData = () => {
  return {
    type: name,
    data: { label: 'meshItem1', color: '#a0a0a0' },
    position: { x: 250, y: 25 },
  }
}

export default function GUI({ id, data, selected }) {
  const updateNodeLabel = useFlow((s) => s.updateNodeLabel)
  const updateNodeData = useFlow((s) => s.updateNodeData)
  let objectNameInputRef = useRef()

  let refInputText = useRef()
  return (
    <div
      className={`text-sm rounded-xl transition-transform duration-300 scale-100  border bg-white ${
        selected ? ' border-cyan-500 shadow-cyan-100 shadow-lg ' : ' border-transparent'
      }`}>
      {handles
        .filter((r) => r.type === 'target')
        .map((r, i, a) => {
          return (
            <Handle
              {...makeHoverStateTarget({ handle: r })}
              type={r.type}
              id={r.id}
              key={r.id}
              className='w-4 h-2 bg-gray-400 rounded-full'
              style={{ left: `calc(50% - 1rem / 2 + 25px * ${i - 0.5})` }}
              position={Position.Top}
            />
          )
        })}

      <div className='flex items-center justify-center'>
        <div
          style={{ backgroundColor: selected ? '#7298ff' : '#a0a0a0' }}
          className='flex items-center justify-center w-12 h-10 rounded-l-xl'>
          <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'>
            <path
              fill='white'
              d='M10.26 4.171c-.58-.286-1.093-.517-1.581-.719.77-2.08 1.882-3.452 3.321-3.452 1.402 0 2.494 1.301 3.26 3.292-.492.211-.998.447-1.572.739-.588-1.567-1.258-2.275-1.688-2.275-.442 0-1.14.75-1.74 2.415zm1.74 18.073c-.429 0-1.1-.708-1.688-2.275-.58.295-1.081.528-1.572.739.767 1.991 1.858 3.292 3.26 3.292 1.439 0 2.551-1.372 3.321-3.452-.485-.201-.997-.431-1.581-.719-.6 1.665-1.298 2.415-1.74 2.415zm-4.708-2.216c-1.917.705-4.778 1.392-5.916-.317-.562-.845-.771-2.468 1.42-5.408.582-.78 1.254-1.545 1.937-2.249 1.531-1.554 3.256-3.05 5.505-4.598-1.083-.596-2.264-1.166-3.416-1.591-1.18-.434-2.219-.675-3.015-.675-.508 0-.886.107-1.009.289-.131.192-.138.783.445 1.842l.21-.012c1.048 0 1.897.865 1.897 1.932s-.85 1.932-1.897 1.932-1.897-.865-1.897-1.932c0-.345.089-.669.246-.95-1.11-1.96-.881-3.139-.419-3.815.324-.476 1.009-1.042 2.424-1.042 2.514 0 5.901 1.66 8.082 2.946 2.214-1.363 5.717-3.16 8.304-3.16 1.421 0 2.106.581 2.431 1.069.562.845.771 2.468-1.42 5.407-3.084 4.137-9.216 8.606-13.912 10.332zm12.538-11.394c1.506-2.019 1.552-3.082 1.366-3.361-.126-.189-.492-.298-1.003-.298-1.953 0-4.926 1.459-6.638 2.447 1.265.837 2.445 1.719 3.522 2.617-.407.413-.834.819-1.271 1.211-1.195-.984-2.523-1.947-3.9-2.811-1.581 1.037-3.173 2.254-4.603 3.551 1.075.951 2.356 1.949 3.721 2.873-.522.331-1.05.648-1.652.98l-.013-.009c-1.144-.811-2.271-1.701-3.316-2.632-2.818 2.878-3.612 4.964-3.239 5.525.126.189.492.298 1.003.298 2.35 0 6.08-2.017 8.287-3.464 2.709-1.776 5.799-4.328 7.736-6.927zm2.377 7.091c.141-.27.22-.577.22-.903 0-1.067-.849-1.932-1.897-1.932s-1.897.865-1.897 1.932.849 1.932 1.897 1.932l.258-.018c.553 1.024.544 1.598.415 1.787-.124.181-.501.288-1.009.288-1.602 0-3.833-.945-5.27-1.658-.48.342-1.077.748-1.659 1.119 1.926 1.037 4.758 2.295 6.929 2.295 1.415 0 2.1-.566 2.424-1.042.461-.674.69-1.85-.411-3.8z'
            />
          </svg>
        </div>
        <input
          type='text'
          defaultValue={data.label}
          onChange={(evt) => updateNodeLabel(id, evt.target.value)}
          className='w-full h-10 pl-2 text-xs bg-gray-100 appearance-none nodrag rounded-r-xl'
        />

        <button
          onClick={() => {
            //
            useFlow.setState({
              onSyncMesh: ({ name }) => {
                // console.log(name)
                // updateNodeData(id, 'objectName', name)
                // objectNameInputRef.current.value = name

                if (objectNameInputRef.current) {
                  objectNameInputRef.current.value = name
                }

                //
                window.dispatchEvent(new CustomEvent('onSyncMesh', { detail: { name, id } }))
              },
            })
          }}
          className='p-2 bg-blue-300 rounded-xl'>
          Pick Mesh
        </button>
      </div>

      <div className='flex items-center justify-center'>
        <input
          type='text'
          placeholder='objectName'
          ref={objectNameInputRef}
          defaultValue={data.objectName}
          onChange={(evt) => {
            updateNodeData(id, 'objectName', evt.target.value)

            setTimeout(() => {
              window.dispatchEvent(new CustomEvent('needsUpdate', { detail: {} }))
            }, 50)
          }}
          className='w-full h-10 pl-2 text-xs bg-gray-100 appearance-none nodrag rounded-r-xl'
        />
      </div>

      {handles
        .filter((r) => r.type === 'source')
        .map((r, i) => {
          return (
            <Handle
              type={r.type}
              id={r.id}
              key={r.id}
              className='w-4 h-2 bg-gray-400 rounded-full'
              style={{ left: `calc(50% - 1rem / 2 + 25px * ${i})` }}
              position={Position.Bottom}
            />
          )
        })}
    </div>
  )
}

export const run = async ({ core, globals, getNode, on, send }) => {
  let meshPointer = false
  let timer = 0

  let history = new Map()

  window.addEventListener('onSyncMesh', ({ detail: { name, id } }) => {
    if (id === getNode().id) {
      let scan = core?.now?.scene?.getObjectByName(getNode()?.data?.objectName)
      if (scan) {
        if (!scan.userData.oMat) {
          scan.userData.oMat = scan.material.clone()
        }
        history.set(scan.uuid, scan)
      }
      meshPointer = scan
      for (let item of history.values()) {
        if (item.userData.oMat) {
          item.material = item.userData.oMat.clone()
        }
      }

      window.dispatchEvent(new CustomEvent('needsUpdate', { detail: {} }))
      useFlow.getState().updateNodeData(id, 'objectName', name)
    }
    //
  })

  core.onPreload(() => {
    //
    timer = setInterval(() => {
      let scan = core?.now?.scene?.getObjectByName(getNode()?.data?.objectName)
      if (meshPointer && !scan) {
        if (meshPointer.userData.oMat) {
          meshPointer.material = meshPointer.userData.oMat.clone()
        }
      } else if (scan) {
        if (!meshPointer) {
          window.dispatchEvent(new CustomEvent('needsUpdate', { detail: {} }))
        }

        meshPointer = scan
      } else {
      }
    })
    //
  })

  core.onReady(() => {
    let readyMesh = (fnc = () => {}) => {
      let tt = setInterval(() => {
        if (meshPointer) {
          clearInterval(tt)
          fnc()
        }
      })
    }

    readyMesh(() => {
      if (meshPointer?.material) {
        if (!meshPointer.userData.oMat) {
          meshPointer.userData.oMat = meshPointer.material.clone()
        }
        meshPointer.material = meshPointer.userData.oMat.clone()
      }

      on('geometry', (data) => {
        if (data) {
          meshPointer.geometry = data
        }
      })

      on('material', (data) => {
        // if (!(meshPointer.material instanceof MeshPhysicalMaterial)) {
        //   meshPointer.material = new MeshPhysicalMaterial({})
        // }

        if (meshPointer?.material) {
          for (let kn in data) {
            if (typeof data[kn] !== 'undefined') {
              if (meshPointer.material[kn] !== data[kn]) {
                meshPointer.material[kn] = data[kn]
              }
            }
          }
        } else {
          if (meshPointer) {
            meshPointer.material = meshPointer.userData.oMat.clone()
          }
        }
      })

      window.dispatchEvent(new CustomEvent('needsUpdate', { detail: {} }))
    })

    globals.onClean(() => {
      clearInterval(timer)
      history.clear()
    })
  })
}

//
