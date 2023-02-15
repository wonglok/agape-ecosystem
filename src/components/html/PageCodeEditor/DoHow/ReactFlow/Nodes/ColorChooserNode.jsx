import React from 'react'
import { Handle, Position } from 'reactflow'
import { useRealtime } from '../../Realtime/useRealtime'
import { getID } from '@/backend/aws'

function ColorChooserNode({ id, selected, data }) {
  const updateNodeColor = useRealtime((state) => state.updateNodeColor)
  const updateNodeLabel = useRealtime((state) => state.updateNodeLabel)

  return (
    <div
      className='p-3'
      style={{
        backgroundColor: data.color,
        border: 'black solid 2px',
        borderColor: selected ? 'black' : 'transparent',
        borderRadius: 10,
      }}>
      <Handle type='target' position={Position.Top} />
      <div style={{}}>
        <input
          type='color'
          value={data.color}
          onChange={(evt) => updateNodeColor(id, evt.target.value)}
          className='nodrag'
        />
        {data.color}
      </div>
      <div style={{}}>
        <input
          type='text'
          value={data.label}
          onChange={(evt) => updateNodeLabel(id, evt.target.value)}
          className='nodrag'
        />
      </div>
      <Handle type='source' position={Position.Bottom} />
    </div>
  )
}

export const createItem = () => {
  return {
    id: getID(),
    type: 'ColorChooserNode',
    data: { label: 'new node', color: '#4FD1C5' },
    position: { x: 250, y: 25 },
  }
}

export const displayName = 'ColorPickerNode'

export default ColorChooserNode
