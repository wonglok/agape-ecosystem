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
      <Handle type='target' id='color' position={Position.Left} />
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
      <Handle type='source' id='material' position={Position.Bottom} />
    </div>
  )
}
