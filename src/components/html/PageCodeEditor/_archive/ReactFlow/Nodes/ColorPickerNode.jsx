import React from 'react'
import { Handle, Position } from 'reactflow'
import { useRealtime } from '../../Realtime/useRealtime'
import { getID } from '@/backend/aws'

function ColorPickerNode({ id, selected, data }) {
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
      <Handle
        type='target'
        id='target0'
        style={{ top: 'calc(15px + 20px * 0.0)', width: `10px`, height: `10px` }}
        position={Position.Left}
      />
      <Handle
        type='target'
        id='target1'
        style={{ top: 'calc(15px + 20px * 1.0)', width: `10px`, height: `10px` }}
        position={Position.Left}
      />
      <div style={{}}>
        <input
          type='color'
          defaultValue={data.color}
          onChange={(evt) => updateNodeColor(id, evt.target.value)}
          className='nodrag'
        />
        {data.color}
      </div>
      <div style={{}}>
        <input
          type='text'
          defaultValue={data.label}
          onChange={(evt) => updateNodeLabel(id, evt.target.value)}
          className='nodrag'
        />
      </div>
      <Handle
        type='source'
        id='source0'
        style={{ top: 'calc(15px + 20px * 0.0)', width: `10px`, height: `10px` }}
        position={Position.Right}
      />
      <Handle
        type='source'
        id='source1'
        style={{ top: 'calc(15px + 20px * 1.0)', width: `10px`, height: `10px` }}
        position={Position.Right}
      />
    </div>
  )
}

export const handles = [
  {
    id: 'source0',
    type: 'source',
  },
  {
    id: 'source1',
    type: 'source',
  },
]

export const createItem = () => {
  return {
    id: getID(),
    type: 'ColorPickerNode',
    data: { label: 'new node', color: '#4FD1C5' },
    position: { x: 250, y: 25 },
  }
}

export const displayName = 'ColorPickerNode'

export default ColorPickerNode
