import { Cascader } from 'antd'
import { useEffect, useState } from 'react'
import { NodeOptions, NodeTypes } from '../NodeTypes'
import { useKeyPress, useOnSelectionChange, useReactFlow } from 'reactflow'
import { getID } from '@/backend/aws'
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

export const PopChooser = ({ api, nodes, guiRef }) => {
  let [config, setConfig] = useState({ type: '', payload: false })

  let [selNode, setSelNode] = useState(false)
  useOnSelectionChange({
    onChange: ({ nodes, edges }) => {
      console.log('changed selection', nodes, edges)
      let sel = nodes[0]
      setSelNode(sel)
    },
  })

  let down = useKeyPress('Space')
  const { project } = useReactFlow()

  useEffect(() => {
    console.log(selNode)
    if (down && selNode) {
      // const id = getID()
      // const newNode = config.payload
      // newNode.id = id
      // newNode.position.x = selNode.position.x + 75
      // newNode.position.y = selNode.position.y

      // api.doc.getMap('nodes').set(newNode.id, newNode)

      // let newEdge = { id: getID(), source: connectingNodeId.current, target: id }
      // api.doc.getMap('edges').set(newEdge.id, newEdge)

      guiRef.current.style.display = 'block'
      guiRef.current.style.top = `50%`
      guiRef.current.style.left = `calc(50% - 100px)`

      let newEdgeID = getID()
      guiRef.current.onConnectNode = (payload) => {
        let newEdge = { id: newEdgeID, source: selNode.id, target: payload.id }

        api.doc.getMap('edges').set(newEdge.id, newEdge)

        guiRef.current.style.display = 'none'
      }
      guiRef.current.onAddNode = (payload) => {
        //
        const id = getID()

        const newNode = payload
        newNode.id = id
        newNode.position = project({ x: window.innerWidth / 2 - 100, y: window.innerHeight / 2 - 75 })

        api.doc.getMap('nodes').set(newNode.id, newNode)

        let newEdge = { id: getID(), source: selNode.id, target: id }
        api.doc.getMap('edges').set(newEdge.id, newEdge)

        guiRef.current.style.display = 'none'
      }
    }
  }, [api.doc, down, guiRef, project, selNode])

  return (
    <div className='p-3 bg-white border-2 border-gray-500 shadow-2xl rounded-2xl '>
      <Cascader
        className='mb-3 w-96'
        options={getOptions({ nodes })}
        onChange={(ev) => {
          if (ev[0] === 'connect') {
            let nodeID = ev[ev.length - 1]
            let node = nodes.find((n) => n.id === nodeID)

            if (node) {
              setConfig({
                type: ev[0],
                payload: node,
              })
            } else {
              setConfig({
                type: ev[0],
                payload: false,
              })
            }
          } else if (ev[0] === 'create') {
            if (ev[0] && ev[1] && ev[1]?.id) {
              setConfig({
                type: ev[0],
                payload: ev[1],
              })
            } else {
              setConfig({
                type: ev[0],
                payload: false,
              })
            }
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
              className='px-3 py-2 text-xs text-white bg-blue-500 rounded-xl  disabled:opacity-50'
              onClick={() => {
                guiRef.current.onAddNode(config.payload)
              }}
              disabled={!config.payload}>
              <>Create</>
            </button>
          )}
          {config.type === 'connect' && (
            <button
              className='px-3 py-2 text-xs text-white bg-blue-500 rounded-xl disabled:opacity-50'
              onClick={() => {
                guiRef.current.onConnectNode(config.payload)
              }}
              disabled={!config.payload}>
              <>Connect</>
            </button>
          )}
          <button
            className='px-3 py-2 ml-2 text-xs text-white bg-gray-500 rounded-xl'
            onClick={() => {
              guiRef.current.style.display = 'none'
            }}>
            <>Cancel</>
          </button>
        </div>
      }
    </div>
  )
}
