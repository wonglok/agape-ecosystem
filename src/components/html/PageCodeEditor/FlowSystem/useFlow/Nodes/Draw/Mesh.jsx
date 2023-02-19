import React from 'react'
import { Handle, Position } from 'reactflow'
import { useFlow } from '../../useFlow'
import { getTemplateByNodeInstance } from '../../nodeTypes'

export const handles = [
  //
  { type: 'target', dataType: 'material', id: 'material', displayName: 'Material' },
  { type: 'target', dataType: 'geometry', id: 'geometry', displayName: 'Geometry' },
  { type: 'source', dataType: 'object3d', id: 'object3d', displayName: 'Object3D' },
]

export const name = 'Mesh'

export const createData = () => {
  return {
    type: name,
    data: { label: 'meshItem1', color: '#ffffff' },
    position: { x: 250, y: 25 },
  }
}

export default function GUI({ id, data }) {
  const updateNodeLabel = useFlow((s) => s.updateNodeLabel)
  const updateNodeColor = useFlow((s) => s.updateNodeColor)

  return (
    <div className='flex items-center justify-center text-sm' style={{ backgroundColor: data.color }}>
      {handles
        .filter((r) => r.type === 'target')
        .map((r, i) => {
          return (
            <Handle
              isValidConnection={(connection) => {
                // console.log(connection)
                let oppositeNode = useFlow.getState().nodes.find((n) => n.id === connection.source)
                let template = getTemplateByNodeInstance(oppositeNode)
                let removeHandle = template.handles.find((h) => h.id === connection.sourceHandle)
                return removeHandle?.dataType === r.dataType
              }}
              type={r.type}
              id={r.id}
              key={r.id}
              className=''
              style={{ left: `calc(10px + 20px * ${i})` }}
              position={Position.Top}
            />
          )
        })}

      <div className='flex flex-col items-center justify-center'>
        <input
          type='text'
          defaultValue={data.label}
          onChange={(evt) => updateNodeLabel(id, evt.target.value)}
          className='m-1 text-xs nodrag'
        />
        {/*  */}
        <input
          type='color'
          defaultValue={data.color}
          onChange={(evt) => updateNodeColor(id, evt.target.value)}
          className='m-1 text-xs'
        />
      </div>

      {handles
        .filter((r) => r.type === 'source')
        .map((r, i) => {
          return (
            <Handle
              isValidConnection={(connection) => {
                let oppositeNode = useFlow.getState().nodes.find((n) => n.id === connection.target)
                let template = getTemplateByNodeInstance(oppositeNode)
                let removeHandle = template.handles.find((h) => h.id === connection.targetHandle)
                return removeHandle?.dataType === r.dataType
              }}
              type={r.type}
              id={r.id}
              key={r.id}
              className=''
              style={{ left: `calc(10px + 20px * ${i})` }}
              position={Position.Bottom}
            />
          )
        })}
    </div>
  )
}

export const run = async () => {
  //

  return () => {
    //
  }
}
