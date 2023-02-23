import React from 'react'
import { Handle, Position } from 'reactflow'
import { useFlow } from '../../useFlow'
import { getTemplateByNodeInstance } from '../../nodeTypes'
import { Color, MeshPhysicalMaterial } from 'three'
import { ExportParamter } from '../../SharedGUI/ExportParamter'
import { makeHoverStateTarget } from '../../SharedGUI/HoverState'

export const handles = [
  //
  { type: 'target', dataType: 'material', id: 'receiver', displayName: 'Inherit', position: Position.Top },

  { type: 'target', dataType: 'color', id: 'color', displayName: 'Color' },
  { type: 'target', dataType: 'number', id: 'ior', displayName: 'Index of Refraction' },
  { type: 'target', dataType: 'number', id: 'thickness', displayName: 'Thickness' },
  { type: 'target', dataType: 'number', id: 'transmission', displayName: 'Transmission' },
  { type: 'target', dataType: 'number', id: 'roughness', displayName: 'Roughness' },
  { type: 'target', dataType: 'number', id: 'metalness', displayName: 'Metalness' },

  { type: 'source', dataType: 'material', id: 'material', displayName: 'Material' },
]

export const name = 'InstanceMaterial'

export const createData = () => {
  return {
    type: name,
    data: { label: 'instanceMaterial1', color: '#a0a0a0' },
    position: { x: 250, y: 25 },
  }
}

export default function GUI({ id, data, selected }) {
  const updateNodeLabel = useFlow((s) => s.updateNodeLabel)

  return (
    <div
      className={`text-sm rounded-xl transition-transform duration-300 scale-100  border bg-white ${
        selected ? ' border-cyan-500 shadow-cyan-100 shadow-lg ' : ' border-transparent'
      }`}>
      {handles
        .filter((r) => r.position === Position.Top)
        .filter((r) => r.type === 'target')
        .map((r, i) => {
          return (
            <Handle
              isValidConnection={(connection) => {
                let oppositeNode = useFlow.getState().nodes.find((n) => n.id === connection.source)
                let template = getTemplateByNodeInstance(oppositeNode)
                let remoteHandle = template.handles.find((h) => h.id === connection.sourceHandle)
                return remoteHandle?.dataType === r.dataType
              }}
              {...makeHoverStateTarget({ handle: r })}
              type={r.type}
              id={r.id}
              key={r.id}
              className='w-4 h-2 bg-gray-400 rounded-full hover:shadow-lg hover:shadow-cyan-500 hover:bg-cyan-400'
              style={{ left: `calc(50% + 15px * ${i})` }}
              position={r.position}
            />
          )
        })}

      {handles
        .filter((r) => r.position !== Position.Top)
        .filter((r) => r.type === 'target')
        .map((r, i) => {
          return (
            <Handle
              isValidConnection={(connection) => {
                let oppositeNode = useFlow.getState().nodes.find((n) => n.id === connection.source)
                let template = getTemplateByNodeInstance(oppositeNode)
                let remoteHandle = template.handles.find((h) => h.id === connection.sourceHandle)
                return remoteHandle?.dataType === r.dataType
              }}
              {...makeHoverStateTarget({ handle: r })}
              type={r.type}
              id={r.id}
              key={r.id}
              className='w-2 h-4 bg-gray-400 rounded-full hover:shadow-lg hover:shadow-cyan-500 hover:bg-cyan-400'
              style={{ top: `calc(52px + 24px * ${i})` }}
              position={Position.Left}
            />
          )
        })}

      <div className='flex items-center justify-center rounded-t-xl'>
        <div
          style={{ backgroundColor: selected ? '#6C6F72' : '#C2C2C2' }}
          className='flex items-center justify-center w-12 h-10 bg-transparent  rounded-tl-xl '>
          <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'>
            <path
              fill='white'
              d='M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-6.373 16.199c3.809.315 2.446-3.73 5.97-3.769l1.526 1.274c.381 4.6-5.244 5.626-7.496 2.495zm8.293-3.396l-1.549-1.293c.457-2.18 1.854-4.188 3.267-5.51l3.362 2.804c-1.041 1.636-3.023 3.154-5.08 3.999z'
            />
          </svg>
        </div>

        <input
          type='text'
          defaultValue={data.label}
          onChange={(evt) => updateNodeLabel(id, evt.target.value)}
          className='w-full h-10 pl-2 text-xs bg-gray-100 appearance-none nodrag rounded-r-xl'
        />

        <ExportParamter id={id} data={data}></ExportParamter>

        {/* <input
          type='color'
          defaultValue={data.color}
          onChange={(evt) => updateNodeColor(id, evt.target.value)}
          className='inline-block h-10 text-xs opacity-0 appearance-none cursor-grabbing y-0'
        /> */}
      </div>

      {handles
        .filter((r) => r.position !== Position.Top)
        .filter((r) => r.id !== 'material')
        .map((h) => {
          return (
            <div key={h.id} className='flex items-center w-full text-xs bg-white '>
              <div className='py-1 ml-2 '>{h.displayName}</div>
            </div>
          )
        })}

      <div className='flex items-center w-full text-xs '>
        <div className='py-1 ml-2'></div>
      </div>
      <div>
        {handles
          .filter((r) => r.type === 'source')
          .map((r, i) => {
            return (
              <Handle
                isValidConnection={(connection) => {
                  // console.log(connection)
                  let oppositeNode = useFlow.getState().nodes.find((n) => n.id === connection.target)
                  let template = getTemplateByNodeInstance(oppositeNode)
                  let remoteHandle = template.handles.find((h) => h.id === connection.targetHandle)
                  return remoteHandle?.dataType === r.dataType
                }}
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
    </div>
  )
}

export const run = async ({ core, globals, getNode, on, send, share }) => {
  //
  core.now.cache = new Map()
  core.onReady(() => {
    let physical = new MeshPhysicalMaterial({})

    let readyPhy = (fnc = () => {}) => {
      let tt = setInterval(() => {
        if (physical) {
          clearInterval(tt)
          fnc()
        }
      })
    }

    let onValue = async (key, setter) => {
      on(key, (value) => {
        readyPhy(() => {
          core.now.cache.set(key, value)
          setter(value)
          send('material', physical)
        })
      })

      return new Promise((resolve, reject) => {
        let item = core.now.cache.has(key)
        let tt = setInterval(() => {
          if (item) {
            clearInterval(tt)
            resolve(core.now.cache.get(key))
            setter(core.now.cache.get(key))
          }
        })
      })
    }

    on('receiver', async (material) => {
      physical = material.clone()
      share(physical, getNode().id)
      send('material', physical)

      onValue('color', (value) => {
        physical['color'] = value
      })
      onValue('thickness', (value) => {
        physical['thickness'] = value
      })
      onValue('ior', (value) => {
        physical['ior'] = value
      })
      onValue('transmission', (value) => {
        physical['transmission'] = value
      })
      onValue('roughness', (value) => {
        physical['roughness'] = value
      })
      onValue('metalness', (value) => {
        physical['metalness'] = value
      })
    })

    globals.onClean(() => {
      readyPhy(() => {
        physical?.dispose()
      })
    })
  })
}
