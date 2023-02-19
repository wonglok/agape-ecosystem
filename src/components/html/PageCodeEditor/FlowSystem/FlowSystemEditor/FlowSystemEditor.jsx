import ReactFlow, { ReactFlowProvider, useReactFlow, useViewport } from 'reactflow'
import { Background, Controls } from 'reactflow'
import { shallow } from 'zustand/shallow'
import { useFlow } from '../useFlow/useFlow'
import { nodeTypes } from '../useFlow/nodeTypes'
import { useRef } from 'react'
import { ConnectionHelper } from './ConnectionHelper/ConnectionHelper'

export function FlowSystemEditor() {
  return (
    <ReactFlowProvider>
      <FlowSystemEditorCore></FlowSystemEditorCore>
    </ReactFlowProvider>
  )
}

export function FlowSystemEditorCore() {
  let reactFlowWrapper = useRef()

  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, onConnectEnd, onConnectStart } = useFlow(
    (state) => ({
      nodes: state.nodes,
      edges: state.edges,
      onNodesChange: state.onNodesChange,
      onEdgesChange: state.onEdgesChange,
      onConnect: state.onConnect,
      onConnectStart: state.onConnectStart,
      onConnectEnd: state.onConnectEnd,
    }),
    shallow,
  )

  let { showTool, toolTop, toolLeft } = useFlow((r) => ({
    toolTop: r.toolTop,
    toolLeft: r.toolLeft,
    showTool: r.showTool,
  }))

  const { project } = useReactFlow()

  return (
    <div className='relative w-full h-full' ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onConnectEnd={onConnectEnd({ reactFlowWrapper, project })}
        onConnectStart={onConnectStart}
        fitView>
        <Background />
        <Controls />
      </ReactFlow>
      <div
        style={{
          position: 'fixed',
          zIndex: '50',
          top: `${toolTop}`,
          left: `${toolLeft}`,
          display: showTool ? 'block' : 'none',
        }}>
        {<ConnectionHelper></ConnectionHelper>}
      </div>
    </div>
  )
}

//onConnectEnd
