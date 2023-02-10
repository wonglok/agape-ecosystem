import React, { memo } from 'react'
import { Handle, Position } from 'reactflow'

function CustomNode({ data }) {
  return (
    <div className='px-4 py-2 my-6 bg-white border-2 shadow-md rounded-md border-stone-400'>
      <div className='flex'>
        <div className='flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full'>{data.emoji}</div>
        <div className='ml-2'>
          <div className='text-lg font-bold'>{data.name}</div>
          <div className='text-gray-500'>{data.job}</div>
        </div>
      </div>

      <Handle type='target' position={Position.Top} className='w-20 h-5 rounded-full !bg-teal-500' />
      <Handle type='source' position={Position.Bottom} className='w-20 h-5 rounded-full !bg-teal-500' />
    </div>
  )
}

export default memo(CustomNode)
