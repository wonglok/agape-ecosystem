import React from 'react'
import { Handle, Position } from 'reactflow'
import { useFlow } from '../../useFlow'

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
      <Handle
        type='target'
        id='material'
        className=''
        style={{ width: `calc(10px + 20px * 0)` }}
        position={Position.Top}
      />
      <Handle
        type='target'
        id='geometry'
        className=''
        style={{ width: `calc(10px + 20px * 1)` }}
        position={Position.Top}
      />
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

      <Handle type='source' id='object3d' position={Position.Bottom} />
    </div>
  )
}

export const run = async () => {
  //

  return () => {
    //
  }
}
