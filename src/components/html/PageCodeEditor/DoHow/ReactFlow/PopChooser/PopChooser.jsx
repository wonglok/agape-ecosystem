import { Cascader } from 'antd'
import { useState } from 'react'
import { NodeOptions } from '../NodeTypes'
const getOptions = ({ nodes }) => {
  //!SECTION

  let set = new Set()
  let typesOfNodes = []
  nodes.forEach((it) => {
    if (!set.has(it.type)) {
      set.add(it.type)
    }
  })

  for (let val of set.values()) {
    typesOfNodes.push(val)
  }

  // console.log(typesOfNodes)

  //
  return [
    {
      value: 'create',
      label: 'Create',
      children: [
        ...NodeOptions.map((r) => {
          return {
            label: r.label,
            value: r.value,
          }
        }),
        // {
        //   value: 'hangzhou',
        //   label: 'Hanzhou',
        //   children: [
        //     {
        //       value: 'xihu',
        //       label: 'West Lake',
        //     },
        //   ],
        // },
      ],
    },
    {
      value: 'connect',
      label: 'Connect',
      children: [
        ...typesOfNodes.map((r) => {
          return {
            value: r,
            label: r,
            children: nodes
              .filter((n) => n.type === r)
              .map((n) => {
                return {
                  label: n.data.label,
                  value: n.id,
                }
              }),
          }
        }),
        // ...nodes.map((r) => {
        //   return {
        //     value: r.id,
        //     label: r.color,
        //   }
        // }),
      ],
    },
  ]
}

export const PopChooser = ({ nodes, mousePopChooser }) => {
  let [config, setConfig] = useState({ type: '', payload: false })

  return (
    <>
      <Cascader
        className='w-96'
        options={getOptions({ nodes })}
        onChange={(ev) => {
          if (ev[0] === 'connect') {
            let nodeID = ev[ev.length - 1]
            setConfig({
              type: ev[0],
              payload: nodes.find((n) => n.id === nodeID),
            })
          } else if (ev[0] === 'create') {
            setConfig({
              type: ev[0],
              payload: ev[ev.length - 1],
            })
          }

          return null
        }}
        expandTrigger={'hover'}
        showSearch={true}
        changeOnSelect={true}
      />
      {
        <div className='flex'>
          {config.type === 'create' && (
            <button
              className='px-3 py-2 text-xs text-white bg-blue-500 rounded-xl'
              onClick={() => {
                mousePopChooser.current.onAddNode(config.payload)
              }}>
              <>Create</>
            </button>
          )}
          {config.type === 'connect' && (
            <button
              className='px-3 py-2 text-xs text-white bg-blue-500 rounded-xl'
              onClick={() => {
                mousePopChooser.current.onConnectNode(config.payload)
              }}>
              <>Connect</>
            </button>
          )}
          <button
            className='px-3 py-2 text-xs text-white bg-gray-500 rounded-xl'
            onClick={() => {
              mousePopChooser.current.style.display = 'none'
            }}>
            <>Cancel</>
          </button>
        </div>
      }
    </>
  )
}
