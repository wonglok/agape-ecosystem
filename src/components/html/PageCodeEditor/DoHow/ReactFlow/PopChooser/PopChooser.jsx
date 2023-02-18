import { Cascader } from 'antd'
import { useEffect, useState } from 'react'
import { NodeOptions, NodeTypes } from '../NodeTypes'
import { useKeyPress, useOnSelectionChange, useReactFlow } from 'reactflow'
import { useRealtime } from '../../Realtime/useRealtime'
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
      ],
    },
  ]
}

export const PopChooser = ({ nodes, guiRef }) => {
  let [config, setConfig] = useState({ type: '', payload: false })

  let [chosenNode, setSelectedNodes] = useState(false)
  let [chosenEdge, setSelectedEdges] = useState(false)
  // let currentAPI = useRealtime((s) => s.currentAPI)
  useOnSelectionChange({
    onChange: ({ nodes, edges }) => {
      let sel = nodes[0]
      setSelectedNodes(sel)
    },
  })

  let down = useKeyPress('Space')
  const { project } = useReactFlow()

  useEffect(() => {
    if (down && chosenNode) {
      useRealtime.setState({
        showTool: true,
        toolTop: `50%`,
        toolLeft: `calc(50% - 100px)`,
        newNodePos: project({ x: window.innerWidth / 2 - 100, y: window.innerHeight / 2 - 75 }),
        connectingNodeId: chosenNode.id,
      })
    }
  }, [down, guiRef, project, chosenNode])

  return (
    <div className='p-3 bg-white border-2 border-gray-500 shadow-2xl rounded-2xl '>
      <Cascader
        className='mb-3 w-96'
        options={getOptions({ nodes })}
        onChange={(segs) => {
          console.log(segs)
          // if (ev[0] === 'connect') {
          //   let nodeID = ev[ev.length - 1]
          //   let node = nodes.find((n) => n.id === nodeID)

          //   if (node) {
          //     setConfig({
          //       type: ev[0],
          //       payload: node,
          //     })
          //   } else {
          //     setConfig({
          //       type: ev[0],
          //       payload: false,
          //     })
          //   }
          // } else if (ev[0] === 'create') {
          //   if (ev[0] && ev[1] && ev[1]?.id) {
          //     setConfig({
          //       type: ev[0],
          //       payload: ev[1],
          //     })
          //   } else {
          //     setConfig({
          //       type: ev[0],
          //       payload: false,
          //     })
          //   }
          // }

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
              className='px-3 py-2 text-xs text-white bg-blue-500 rounded-xl  disabled:opacity-50'
              onClick={() => {
                useRealtime.getState().onAddNode(config.payload)
              }}
              disabled={!config.payload}>
              <>Create</>
            </button>
          )}
          {config.type === 'connect' && (
            <button
              className='px-3 py-2 text-xs text-white bg-blue-500 rounded-xl disabled:opacity-50'
              onClick={() => {
                useRealtime.getState().onConnectNode(config.payload)
              }}
              disabled={!config.payload}>
              <>Connect</>
            </button>
          )}
          <button
            className='px-3 py-2 ml-2 text-xs text-white bg-gray-500 rounded-xl'
            onClick={() => {
              useRealtime.setState({ showTool: false })
            }}>
            <>Cancel</>
          </button>
        </div>
      }
    </div>
  )
}
