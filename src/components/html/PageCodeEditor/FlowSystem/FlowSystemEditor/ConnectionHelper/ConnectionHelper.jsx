import { useOnSelectionChange } from 'reactflow'
import { useFlow } from '../../useFlow/useFlow'
import { Cascader } from 'antd'
import { nodeHandlesByNodeTypes, nodeTemplateList } from '../../useFlow/nodeTypes'
import { useMemo } from 'react'

export function ConnectionHelper() {
  useOnSelectionChange({
    onChange: ({ nodes = [], edges = [] }) => {
      useFlow.setState({ selectedNodes: nodes, selectedEdges: edges })
    },
  })

  let nodes = useFlow((s) => s.nodes)

  let options = useMemo(() => {
    return getOptions({ nodes })
  }, [nodes])

  let connHelperAction = useFlow((s) => s.connHelperAction)
  let autoConnectName = useFlow((s) => s.autoConnectName)
  let createModuleName = useFlow((s) => s.createModuleName)
  let connectModuleName = useFlow((s) => s.connectModuleName)
  let onAddNode = useFlow((s) => s.onAddNode)
  return (
    <div className='p-3 bg-gray-300 border rounded-lg bg-opacity-40  backdrop-blur-lg '>
      <Cascader
        className='mb-3 w-96'
        options={options}
        onChange={(segs) => {
          console.log(segs)

          if (segs[0] === 'create') {
            useFlow.setState({ connHelperAction: segs[0], createModuleName: segs[1], autoConnectName: segs[2] })
          }
          if (segs[0] === 'connect') {
            useFlow.setState({ connHelperAction: segs[0], connectModuleName: segs[1], autoConnectName: segs[2] })
          }

          return null
        }}
        expandTrigger={'hover'}
        showSearch={true}
        changeOnSelect={true}
      />

      <div className='flex'>
        {connHelperAction === 'create' && (
          <button
            className='px-3 py-2 mr-2 text-xs text-white bg-blue-500 rounded-xl disabled:opacity-50'
            onClick={() => {
              //
              onAddNode()
            }}
            disabled={!(connHelperAction && createModuleName && autoConnectName)}>
            <>Create</>
          </button>
        )}
        {connHelperAction === 'connect' && (
          <button
            className='px-3 py-2 mr-2 text-xs text-white bg-blue-500 rounded-xl disabled:opacity-50'
            onClick={() => {
              //
            }}
            disabled={!(connHelperAction && connectModuleName && autoConnectName)}>
            <>Connect</>
          </button>
        )}
        <button
          className='px-3 py-2 text-xs text-white bg-gray-500 rounded-xl'
          onClick={() => {
            useFlow.setState({ showTool: false })
          }}>
          <>Cancel</>
        </button>
      </div>

      {/*  */}

      {/*  */}
    </div>
  )
}

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
        ...nodeTemplateList.map((r) => {
          return {
            label: r.type,
            value: r.type,
            children: (r?.module?.handles || [])
              .filter((h) => {
                if (useFlow.getState()?.hand?.handleType === 'source') {
                  if (h.type === 'target') {
                    return true
                  }
                } else if (useFlow.getState()?.hand?.handleType === 'target') {
                  if (h.type === 'source') {
                    return true
                  }
                }

                return false
              })
              .map((handle) => {
                return {
                  label: `${handle.displayName} (AutoConnect, ${handle.type === 'source' ? 'output' : 'input'})`,
                  value: handle.id,
                }
              }),
          }
        }),
      ],
    },
    {
      value: 'connect',
      label: 'Connect',
      children: [
        ...nodes
          .filter((r) => r.id !== useFlow.getState().hand.nodeId)
          .map((n) => {
            return {
              label: `${n.data.label} (${n.type})`,
              value: n.id,
            }
          }),
      ],
    },
  ]
}
