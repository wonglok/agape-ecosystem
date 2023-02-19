import React from 'react'
import { Handle, Position } from 'reactflow'
import { useFlow } from '../../useFlow'

export const handles = [
  //
  { type: 'target', dataType: 'color', id: 'color', displayName: 'Color' },
  { type: 'source', dataType: 'material', id: 'material', displayName: 'Material' },
]

export const name = 'PhysicalMaterial'

export const createData = () => {
  return {
    type: name,
    data: { label: 'materialPhysical1', color: '#ffffff' },
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
          className='m-1 nodrag'
        />
        <input
          type='color'
          defaultValue={data.color}
          onChange={(evt) => updateNodeColor(id, evt.target.value)}
          className='m-1'
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
              className=''
              style={{ left: `calc(10px + 20px * ${i})` }}
              position={Position.Bottom}
            />
          )
        })}
    </div>
  )
}
