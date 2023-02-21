import { Handle, Position } from 'reactflow'
import { useFlow } from '../../useFlow'
import { getTemplateByNodeInstance } from '../../nodeTypes'
import { makeHoverStateTarget } from '../../SharedGUI/HoverState'
import { RunnerObject } from '../../../FlowSystemRunner/RunnerObject/RunnerObject'

// [
//   // //
//   // { type: 'target', dataType: 'geometry', id: 'geometry', displayName: 'Geometry' },
//   // { type: 'target', dataType: 'material', id: 'material', displayName: 'Material' },
//   // { type: 'source', dataType: 'object3d', id: 'object3d', displayName: 'Object3D' },
// ]

export const name = 'Capsule'

let dynamicHandles = []
export const provideHandle = ({ nodes }) => {
  let handlesInt = []

  nodes.filter((n) => {
    let temp = getTemplateByNodeInstance(n)

    if (n.data.isExposed) {
      temp.handles.forEach((h) => {
        handlesInt.push({
          ...h,
          id: h.id + n.id,
          type: h.type === 'target' ? 'source' : 'target',
          label: n.data.label,
          oldNode: n,
          oldNodeID: n.id,
          oldHandleID: h.id,
          groupName: n.data.groupName,
        })
      })
    }
  })

  handlesInt.forEach((it) => {
    if (
      !dynamicHandles.some((d) => {
        return d.id === it.id
      })
    ) {
      dynamicHandles.push(it)
    }
  })

  return handlesInt
}
export const handles = dynamicHandles

export const createData = () => {
  return {
    type: name,
    data: { label: 'capsule1', nodes: [], edges: [] },
    position: { x: 0, y: 0 },
  }
}

export default function GUI({ id, data, selected }) {
  const updateNodeLabel = useFlow((s) => s.updateNodeLabel)

  provideHandle({ nodes: data.nodes })

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
              isValidConnection={(connection) => {
                let oppositeNode = useFlow.getState().nodes.find((n) => n.id === connection.source)
                let template = getTemplateByNodeInstance(oppositeNode)
                let remoteHandle = template.handles.find((h) => h.id === connection.sourceHandle)
                return remoteHandle?.dataType === r.dataType
              }}
              {...makeHoverStateTarget({ handle: r })}
              type={r.type}
              id={r.id}
              key={r.id + id + i}
              className='w-2 h-4 bg-gray-400 rounded-full hover:shadow-lg hover:shadow-cyan-500 hover:bg-cyan-400'
              style={{ top: `calc(52px + 25px *  ${i})` }}
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
          className='w-full h-10 pl-2 text-xs bg-gray-100 appearance-none nodrag rounded-tr-xl'
        />
        {/* <input
          type='color'
          defaultValue={data.color}
          onChange={(evt) => updateNodeColor(id, evt.target.value)}
          className='inline-block h-10 text-xs opacity-0 appearance-none cursor-grabbing y-0'
        /> */}
      </div>

      {handles
        .filter((r) => r.id !== 'material')
        .map((h) => {
          return (
            <div key={h.id} className='flex items-center w-full text-xs bg-white '>
              <div className='py-1 ml-2 '>
                {/*  */}
                {h.label}
              </div>
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
                key={r.id + id + i}
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

//receiveSettings

export const run = async ({ core, globals, setCompos, getNode, on, send }) => {
  //

  provideHandle({ nodes: getNode().data.nodes }).forEach((hdl) => {
    on(hdl.id, (v) => {
      let template = getTemplateByNodeInstance(hdl.oldNode)
      template.receiveSettings({ node: hdl.oldNode, input: v })
    })
  })

  let nodes = getNode().data.nodes
  let edges = getNode().data.edges

  // handles.forEach((it) => {
  //   console.log(it)

  //   let nds = nodes.find((nid) => nid.id === it.id)
  //   console.log(nds)
  // })

  // nodes
  //   .filter((n) => {
  //     return n.data.isExposed
  //   })
  //   .map((node) => {
  //     console.log(node)
  //   })

  // nodes.map((n) => {
  //   let template = getTemplateByNodeInstance(n)
  //   let handles = template.handles
  //   console.log(handles)
  // })

  setCompos(<RunnerObject nodes={nodes} edges={edges}></RunnerObject>)

  return null
}
