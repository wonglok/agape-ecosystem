import React from 'react'
import { Handle, Position } from 'reactflow'
import { useFlow } from '../../useFlow'
import { getTemplateByNodeInstance } from '../../nodeTypes'

export const handles = [
  //
  { type: 'target', dataType: 'color', id: 'color', displayName: 'Color' },
  { type: 'source', dataType: 'material', id: 'material', displayName: 'Material' },
]

export const name = 'PhysicalMaterial'

export const createData = () => {
  return {
    type: name,
    data: { label: 'materialPhysical1', color: '#bababa' },
    position: { x: 250, y: 25 },
  }
}

export default function GUI({ id, data }) {
  const updateNodeLabel = useFlow((s) => s.updateNodeLabel)
  const updateNodeColor = useFlow((s) => s.updateNodeColor)

  return (
    <div className='text-sm'>
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
              type={r.type}
              id={r.id}
              key={r.id}
              className=''
              style={{ top: `calc(60px + 50px * ${i})` }}
              position={Position.Left}
            />
          )
        })}
      <div style={{ backgroundColor: data.color }} className='flex items-center justify-center'>
        <div className='flex items-center justify-center w-12 h-10 bg-transparent invert'>
          <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'>
            <path d='M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-6.373 16.199c3.809.315 2.446-3.73 5.97-3.769l1.526 1.274c.381 4.6-5.244 5.626-7.496 2.495zm8.293-3.396l-1.549-1.293c.457-2.18 1.854-4.188 3.267-5.51l3.362 2.804c-1.041 1.636-3.023 3.154-5.08 3.999z' />
          </svg>
        </div>

        <input
          type='text'
          defaultValue={data.label}
          onChange={(evt) => updateNodeLabel(id, evt.target.value)}
          className='w-full h-10 pl-2 text-xs appearance-none nodrag'
        />
        <input
          type='color'
          defaultValue={data.color}
          onChange={(evt) => updateNodeColor(id, evt.target.value)}
          className='inline-block w-10 h-10 p-0 text-xs opacity-0 appearance-none y-0'
        />
      </div>
      <div className='flex items-center w-full bg-white'>
        <div className='flex items-center justify-center w-10'>
          <svg width='24' height='24' xmlns='http://www.w3.org/2000/svg' fill-rule='evenodd' clip-rule='evenodd'>
            <path d='M2.598 9h-1.055c1.482-4.638 5.83-8 10.957-8 6.347 0 11.5 5.153 11.5 11.5s-5.153 11.5-11.5 11.5c-5.127 0-9.475-3.362-10.957-8h1.055c1.443 4.076 5.334 7 9.902 7 5.795 0 10.5-4.705 10.5-10.5s-4.705-10.5-10.5-10.5c-4.568 0-8.459 2.923-9.902 7zm12.228 3l-4.604-3.747.666-.753 6.112 5-6.101 5-.679-.737 4.608-3.763h-14.828v-1h14.826z' />
          </svg>
        </div>
        <div className='py-2'>Color</div>
      </div>
      <div className=''></div>
      <div>
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
                className='w-20 h-2 text-white bg-gray-500 rounded-full translate-y-px'
                style={{ left: `calc(50% - 5rem / 2 + 25px * ${i})` }}
                position={Position.Bottom}
              />
            )
          })}
      </div>
    </div>
  )
}
