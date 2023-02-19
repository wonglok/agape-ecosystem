import React from 'react'
import { Handle, Position } from 'reactflow'
import { useFlow } from '../../useFlow'

function ColorPicker({ id, data }) {
  const updateNodeColor = useFlow((s) => s.updateNodeColor)
  const updateNodeLabel = useFlow((s) => s.updateNodeLabel)

  return (
    <div className='flex items-center justify-center text-sm' style={{ backgroundColor: data.color }}>
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
      <Handle type='source' id='color' position={Position.Right} />
    </div>
  )
}

export const handles = [
  //
  { type: 'source', dataType: 'color', id: 'color', displayName: 'Color' },
]

export default ColorPicker
