import { memo } from 'react'
import React from 'react'
import { Handle, Position } from 'reactflow'
import { useFlow } from '../../useFlow'
import { getTemplateByNodeInstance } from '../../nodeTypes'
import { Color } from 'three'
import { ExposeParamter } from '../../SharedGUI/ExposeParamter'
import { makeHoverStateTarget } from '../../SharedGUI/HoverState'
import { NodeResizeControl } from '@reactflow/node-resizer'

export const handles = [
  //
  { type: 'source', dataType: 'color', id: 'color', displayName: 'Color' },
]

export const name = 'ExportGroup'

export const createData = () => {
  return {
    type: name,
    data: { label: 'colorPicker1', color: '#4FD1C5' },
    position: { x: 250, y: 25 },
  }
}

export function GUI({ id, data, selected }) {
  const updateNodeColor = useFlow((s) => s.updateNodeColor)
  const updateNodeLabel = useFlow((s) => s.updateNodeLabel)

  return (
    <div
      className={`text-sm rounded-xl transition-transform duration-300 scale-100  border bg-white ${
        selected ? ' border-cyan-500 shadow-cyan-100 shadow-lg ' : ' border-transparent'
      }`}>
      {handles
        .filter((r) => r.type === 'target')
        .map((r, i) => {
          return (
            <Handle
              isValidConnection={(connection) => {
                // console.log(connection)
                let oppositeNode = useFlow.getState().nodes.find((n) => n.id === connection.source)
                let template = getTemplateByNodeInstance(oppositeNode)
                let remoteHandle = template.handles.find((h) => h.id === connection.sourceHandle)
                return remoteHandle?.dataType === r.dataType
              }}
              {...makeHoverStateTarget({ handle: r })}
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
          style={{ backgroundColor: selected ? '#6C6F72' : '#C2C2C2' }}
          className='flex items-center justify-center w-20 h-10 bg-transparent  rounded-l-xl'>
          <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'>
            <path
              fill='white'
              d='M15.835 7l4.317-3.788c.459.426.885.884 1.272 1.376l-2.798 2.412h-2.791zm6.659-.814c.957 1.723 1.506 3.703 1.506 5.814 0 6.627-5.373 12-12 12s-12-5.373-12-12 5.373-12 12-12c2.453 0 4.732.74 6.634 2.003l-6.151 5.354c-1.37 1.19-.425 2.109-1.553 3.68-.153.214-.242.428-.267.633-.076.622.375 1.146.941 1.216.224.027.473-.018.71-.158 1.785-1.051 2.509.134 3.911-1.091l6.269-5.451zm-9.478 11.834c0-1.473-1.417-1.78-2.001-4.02-.583 2.239-2.015 2.547-2.015 4.02 0 1.093.91 1.98 2.015 1.98s2.001-.887 2.001-1.98z'
            />
          </svg>
        </div>
        <input
          type='text'
          defaultValue={data.label}
          onChange={(evt) => updateNodeLabel(id, evt.target.value)}
          className='w-full h-10 pl-2 text-xs bg-gray-100 appearance-none nodrag'
        />

        <div className='px-3 nodrag'>
          <SettingsGUI data={data} id={id}></SettingsGUI>
        </div>
        {/* <div style={{ backgroundColor: data.color }} className='w-16 mx-1 overflow-hidden border border-2 rounded-xl'>
          <input
            type='color'
            defaultValue={data.color}
            onChange={(evt) => updateNodeColor(id, evt.target.value)}
            className='text-xs opacity-0'
          />
        </div> */}
        <ExposeParamter id={id} data={data}></ExposeParamter>
      </div>

      {handles
        .filter((r) => r.type === 'source')
        .map((r, i) => {
          return (
            <Handle
              isValidConnection={(connection) => {
                // console.log(connection)
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

export function receiveSettings({ node, input }) {
  node.data.color = input
}

export const SettingsGUI = ({ data, id }) => {
  const updateNodeData = useFlow((s) => s.updateNodeData)

  return (
    <>
      <div style={{ backgroundColor: data.color }} className='w-10 overflow-hidden border-2 rounded-xl'>
        <input
          type='color'
          defaultValue={data.color}
          onChange={(evt) => updateNodeData(id, 'color', evt.target.value)}
          className='text-xs opacity-0'
        />
      </div>

      {/*  */}
    </>
  )
}

export const run = async ({ core, globals, getNode, send }) => {
  //
  //
  core.onPreload(() => {})
  core.onReady(() => {
    let color = new Color(getNode().data.color)
    let last = ''
    let tt = setInterval(() => {
      let node = getNode()
      let now = JSON.stringify(node)
      if (last !== now) {
        last = now
        if (node?.data?.color) {
          color.set(node?.data?.color)
        }
        send('color', color)
      }
    })
    globals.onClean(() => {
      //
      clearInterval(tt)
    })
  })
}

const controlStyle = {
  background: 'transparent',
  border: 'none',
}

const CustomNode = ({ data }) => {
  return (
    <>
      {/* <NodeResizeControl style={controlStyle} minWidth={100} minHeight={50}>
        <ResizeIcon />
      </NodeResizeControl> */}

      <Handle type='target' position={Position.Left} />
      <div>{data.label}</div>
      <Handle type='source' position={Position.Right} />
    </>
  )
}

function ResizeIcon() {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='20'
      height='20'
      viewBox='0 0 24 24'
      strokeWidth='2'
      stroke='#ff0071'
      fill='none'
      strokeLinecap='round'
      strokeLinejoin='round'
      style={{ position: 'absolute', right: 5, bottom: 5 }}>
      <path stroke='none' d='M0 0h24v24H0z' fill='none' />
      <polyline points='16 20 20 20 20 16' />
      <line x1='14' y1='14' x2='20' y2='20' />
      <polyline points='8 4 4 4 4 8' />
      <line x1='4' y1='4' x2='10' y2='10' />
    </svg>
  )
}

export default memo(CustomNode)
