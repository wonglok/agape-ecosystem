import React from 'react'
import { Handle, Position } from 'reactflow'
import { useFlow } from '../../useFlow'
import { getTemplateByNodeInstance } from '../../nodeTypes'
import { InputNumber, Slider } from 'antd'

export const handles = [
  //
  { type: 'source', dataType: 'number', id: 'number', displayName: 'Number Picker' },
]

export const name = 'NumberPicker'

export const createData = () => {
  return {
    type: name,
    data: { label: 'numberPicker1', number: 0 },
    position: { x: 250, y: 25 },
  }
}

export default function GUI({ id, data, selected }) {
  const updateNodeData = useFlow((s) => s.updateNodeData)
  const updateNodeLabel = useFlow((s) => s.updateNodeLabel)

  return (
    <div className='text-sm bg-white rounded-xl'>
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
              type={r.type}
              id={r.id}
              key={r.id}
              className='w-2 h-4 bg-gray-400 rounded-full'
              style={{ top: `calc(10px + 20px * ${i})` }}
              position={Position.Left}
            />
          )
        })}
      <div className='flex items-center justify-center'>
        <div
          style={{ backgroundColor: selected ? '#7298ff' : '#a0a0a0' }}
          className='flex items-center justify-center w-12 h-10 bg-transparent  rounded-l-xl'>
          <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'>
            <path
              fill='white'
              d='M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-17 5c0-1.654 1.346-3 3-3h6v9h-9v-6zm0 14v-6h9v9h-6c-1.654 0-3-1.346-3-3zm20 0c0 1.654-1.346 3-3 3h-6v-9h9v6zm0-8h-9v-9h6c1.654 0 3 1.346 3 3v6zm-2 6h-5v-1h5v1zm-5-11h5v1h-5v-1zm0 13v-1h5v1h-5zm-6-2v1h-2v2h-1v-2h-2v-1h2v-2h1v2h2zm-1.793-10.5l1.414 1.414-.707.707-1.414-1.414-1.414 1.414-.708-.707 1.414-1.414-1.414-1.414.707-.707 1.415 1.414 1.415-1.415.708.708-1.416 1.414zm9.793-2c0-.276.224-.5.5-.5s.5.224.5.5-.224.5-.5.5-.5-.224-.5-.5zm1 4c0 .276-.224.5-.5.5s-.5-.224-.5-.5.224-.5.5-.5.5.224.5.5z'
            />
          </svg>
        </div>
        <input
          type='text'
          defaultValue={data.label}
          onChange={(evt) => updateNodeLabel(id, evt.target.value)}
          className='w-full h-10 pl-2 text-xs appearance-none nodrag rounded-r-xl'
        />
        {/* <input
          type='color'
          defaultValue={data.color}
          onChange={(evt) => updateNodeColor(id, evt.target.value)}
          className='h-10 text-xs opacity-0'
        /> */}
      </div>

      <div className='px-3 py-1 pb-3'>
        <Slider
          className='nodrag'
          defaultValue={data.slider}
          onChange={(result) => updateNodeData(id, 'slider', result)}></Slider>
        <InputNumber
          className='w-full nodrag'
          type='number'
          value={data.slider}
          onChange={(result) => updateNodeData(id, 'slider', result)}></InputNumber>
      </div>

      {handles
        .filter((r) => r.type === 'source')
        .map((r, i) => {
          return (
            <Handle
              isValidConnection={(connection) => {
                let oppositeNode = useFlow.getState().nodes.find((n) => n.id === connection.target)
                let template = getTemplateByNodeInstance(oppositeNode)
                let remoteHandle = template.handles.find((h) => h.id === connection.targetHandle)
                return remoteHandle?.dataType === r.dataType
              }}
              type={r.type}
              id={r.id}
              key={r.id}
              className='w-2 h-4 bg-gray-400 rounded-full'
              style={{ top: `calc(20px + 20px * ${i})` }}
              position={Position.Right}
            />
          )
        })}
    </div>
  )
}

export const run = async ({ core, globals, getNode, send }) => {
  //
  core.onPreload(() => {})
  core.onReady(() => {
    let last = ''
    let tt = setInterval(() => {
      let node = getNode()
      let now = JSON.stringify(node)
      if (last !== now) {
        last = now
        send('number', node?.data?.number)
      }
    })
    globals.onClean(() => {
      clearInterval(tt)
    })
  })
}
