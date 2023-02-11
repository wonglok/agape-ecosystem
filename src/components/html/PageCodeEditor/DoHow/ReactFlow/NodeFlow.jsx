import React, { useEffect, useState } from 'react'
import ReactFlow from 'reactflow'
import { shallow } from 'zustand/shallow'

import 'reactflow/dist/style.css'

import useFlowStore from './store'
import { NodeTypes } from './NodeTypes'
import { DemoNodes } from './nodes'
import { DemoEdges } from './edges'
import { useRealtime } from '../Realtime/useRealtime'

const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
})

function Flow() {
  let provideFile = useRealtime((r) => r.provideFile)
  let load = useFlowStore((s) => s.load)
  let [yAPI, setAPI] = useState(false)

  useEffect(() => {
    let api = provideFile({ roomName: 'mytestshader', documentName: 'myDoc' })

    setAPI(api)
    let nodesY = api.doc.getArray('nodes')
    let connectionsY = api.doc.getArray('connections')

    let onNodes = () => {
      //
      load({
        nodes: nodesY.toArray(),
        edges: connectionsY.toArray(),
      })
    }

    let onConnections = () => {
      //
      load({
        nodes: nodesY.toArray(),
        edges: connectionsY.toArray(),
      })
    }

    nodesY.observe(onNodes)
    connectionsY.observe(onConnections)
    return () => {
      nodesY.unobserve(onNodes)
      connectionsY.unobserve(onConnections)

      api.clean()
    }
  }, [load, provideFile])

  const { nodes, edges, onNodesChange, onEdgesChange, onConnect } = useFlowStore(selector, shallow)

  return (
    <>
      {/* <button
        onClick={() => {
          yAPI.doc.getArray('nodes').push([...DemoNodes])
          yAPI.doc.getArray('edges').push([...DemoEdges])
          // load({ nodes: DemoNodes, edges: DemoEdges })
        }}>
        load
      </button> */}

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={NodeTypes}
        fitView></ReactFlow>
    </>
  )
}

export default function Page() {
  //
  return (
    <div className='w-full h-full'>
      <Flow className='w-full h-full'></Flow>
    </div>
  )
}

//
