import ReactFlow, { ReactFlowProvider, useReactFlow, useViewport } from 'reactflow'
import { Background, Controls } from 'reactflow'
import { shallow } from 'zustand/shallow'
import { useFlow } from '../useFlow/useFlow'
import { nodeTypes } from '../useFlow/nodeTypes'
import { useEffect, useRef } from 'react'
import { ConnectionHelper } from './ConnectionHelper/ConnectionHelper'
import { edgeTypes } from '../useFlow/edgeTypes'

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

  const { project, setViewport, fitView, getViewport } = useReactFlow()

  useEffect(() => {
    useFlow.setState({
      fitToView: () => {
        fitView({ padding: 0.1 })
      },
    })
  }, [fitView, setViewport])

  return (
    <div className='relative w-full h-full' ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        edgeTypes={edgeTypes}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onConnectEnd={onConnectEnd({ reactFlowWrapper, project })}
        onConnectStart={onConnectStart}
        fitView
        snapToGrid
        snapGrid={[10, 10]}>
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
