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
            <path d='M24 18.94l-5.691 4.06c-3.072-2.289-5.724-3.023-6.581-3.311-.815-.274-1.343-.798-1.161-1.455.173-.627.802-.839 1.353-.839.488 0 1.241.145 1.664.3l-3.389-4.716c-1.247.123-2.195-.852-2.195-1.979 0-1.104.895-2 2-2s2 .896 2 2c0 .2-.038.39-.093.572l2.192 3.039c.13.182.382.224.563.094.182-.129.225-.382.095-.563l-.663-.929c1.151-.292 1.133-.286 1.233-.286.225 0 .439.107.572.295l.543.76c.129.182.382.224.563.094.182-.129.224-.382.095-.563l-.627-.878c1.123-.259 1.112-.25 1.196-.25.225 0 .439.107.573.295l.46.646c.13.182.382.224.564.094.182-.129.224-.382.094-.563l-.516-.724c.318-.059.482-.091.701-.091.833 0 1.347.527 1.916 1.326 1.47 2.054 1.062 3.503 2.539 5.572zm-8.015-8.233c-.154-3.177-2.77-5.707-5.985-5.707-3.314 0-6 2.686-6 6 0 2.972 2.161 5.432 4.997 5.91.229-.369.525-.688.89-.93l-.782-1.089c-1.775-.41-3.105-1.995-3.105-3.891 0-2.206 1.794-4 4-4s4 1.794 4 4l-.014.139 1.999-.432zm-7.424 8.156c-3.726-.68-6.561-3.944-6.561-7.863 0-4.411 3.589-8 8-8 4.168 0 7.597 3.205 7.964 7.278l.556-.12c.341-.063.635-.118 1.028-.118l.405.037c-.466-5.09-4.741-9.077-9.953-9.077-5.523 0-10 4.477-10 10 0 5.498 4.437 9.956 9.925 9.996-.834-.58-1.265-1.352-1.364-2.133z' />
          </svg>{' '}
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
          className='inline-block w-10 h-10 text-xs'
        />
      </div>
      <div className='flex items-center w-full bg-white'>
        <div className='w-10'></div>
        <div className='flex-grow h-full py-2'>Color</div>
      </div>

      <div className='flex items-center w-full  h-px text-white bg-gray-500'></div>

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
                className='w-2 h-2 rounded-full'
                style={{ left: `calc(50% + 25px * ${i})` }}
                position={Position.Bottom}
              />
            )
          })}
      </div>
    </div>
  )
}
