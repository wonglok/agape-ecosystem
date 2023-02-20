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
  let tt = 0
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
          className='flex items-center justify-center w-12 h-10 bg-transparent  rounded-tl-xl'>
          <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'>
            <path
              fill='white'
              d='M24 7v-2c0-2.761-2.238-5-5-5h-14c-2.761 0-5 2.239-5 5v2h10v2h-10v6h4v2h-4v2c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-2h-8v-2h8v-6h-5v-2h5zm-16 11c0 .552-.447 1-1 1s-1-.448-1-1v-4c0-.552.447-1 1-1s1 .448 1 1v4zm3 0c0 .552-.447 1-1 1s-1-.448-1-1v-4c0-.552.447-1 1-1s1 .448 1 1v4zm3 0c0 .552-.447 1-1 1s-1-.448-1-1v-4c0-.552.447-1 1-1s1 .448 1 1v4zm0-8c0 .552-.447 1-1 1s-1-.448-1-1v-4c0-.552.447-1 1-1s1 .448 1 1v4zm3 0c0 .552-.447 1-1 1s-1-.448-1-1v-4c0-.552.447-1 1-1s1 .448 1 1v4z'
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

      <div className='px-3 pt-1 pb-3 nodrag'>
        <Slider
          className='nodrag'
          min={0}
          max={10}
          step={0.01}
          defaultValue={data.slider}
          onChange={(result) => {
            clearInterval(tt)
            tt = setTimeout(() => {
              updateNodeData(id, 'slider', result)
            }, 16.67)
          }}></Slider>
        <InputNumber
          className='w-full nodrag'
          type='number'
          value={data.slider}
          onChange={(result) => {
            clearInterval(tt)
            tt = setTimeout(() => {
              updateNodeData(id, 'slider', result)
            }, 16.67)
          }}></InputNumber>
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
        send('number', node?.data?.slider)
      }
    })
    globals.onClean(() => {
      clearInterval(tt)
    })
  })
}
