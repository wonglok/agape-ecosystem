import React from 'react'
import ReactFlow from 'reactflow'
import { shallow } from 'zustand/shallow'

import 'reactflow/dist/style.css'

import useStore from './store'
import ColorChooserNode from './Nodes/ColorChooserNode'
import { NodeTypes } from './NodeTypes'
// import { DemoNodes } from './nodes'
// import { DemoEdges } from './edges'

const nodeTypes = NodeTypes //{ colorChooser: ColorChooserNode }

const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
})

function Flow() {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect } = useStore(selector, shallow)

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      nodeTypes={nodeTypes}
      fitView
    />
  )
}

export default function Page() {
  //
  let load = useStore((s) => s.load)

  return (
    <div className='w-full h-full'>
      {/* <button
        onClick={() => {
          //
          load({ nodes: DemoNodes, edges: DemoEdges })
        }}>
        123
      </button> */}
      <Flow className='w-full h-full'></Flow>
    </div>
  )
}
