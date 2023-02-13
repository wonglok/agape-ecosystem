import React, { useCallback, useEffect, useRef, useState } from 'react'
import ReactFlow, { Background, Controls, MiniMap, ReactFlowProvider, useReactFlow } from 'reactflow'
import { shallow } from 'zustand/shallow'
import 'reactflow/dist/style.css'
import { NodeTypes } from './NodeTypes'
import { useFlowStore } from './useFlowStore'
import { AWSData, getID } from '@/backend/aws'
import { useRealtime } from '../Realtime/useRealtime'
import { PopChooser } from './PopChooser/PopChooser'
import { OnSpace } from './Keyboard/OnSpace'

const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
})

function Flow() {
  let makeCurrent = useRealtime((s) => s.makeCurrent)
  let currentAPI = useRealtime((s) => s.currentAPI)

  const { nodes, edges, onNodesChange, onEdgesChange, onConnect } = useFlowStore(selector, shallow)
  useEffect(() => {
    return makeCurrent({ roomName: 'room', documentName: 'doc93' })
  }, [makeCurrent])

  const minimapStyle = {
    height: 120,
  }
  const connectingNodeId = useRef(null)
  const { project } = useReactFlow()

  const fitViewOptions = {
    padding: 1,
  }

  let reactFlowWrapper = useRef()
  let mousePopChooser = useRef()

  // const onConnect2 = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [])

  const onConnectStart = useCallback((_, { nodeId }) => {
    // connectingNodeId.current = nodeId
    useRealtime.setState({ connectingNodeId: nodeId })
  }, [])

  const onConnectEnd = useCallback(
    (event) => {
      if (!currentAPI) {
        return
      }

      const targetIsPane = event.target.classList.contains('react-flow__pane')

      if (targetIsPane) {
        // we need to remove the wrapper bounds, in order to get the correct position
        const { top, left } = reactFlowWrapper.current.getBoundingClientRect()

        useRealtime.setState({
          showTool: true,
          toolTop: `${event.clientY - top}px`,
          toolLeft: `${event.clientX - left}px`,
          newNodePos: project({ x: event.clientX - left, y: event.clientY - top - 10 }),
        })

        // mousePopChooser.current.
        // mousePopChooser.current
      }
    },
    [currentAPI, project],
  )

  let { showTool, toolTop, toolLeft } = useRealtime((r) => ({
    toolTop: r.toolTop,
    toolLeft: r.toolLeft,
    showTool: r.showTool,
  }))

  return (
    <div className='w-full h-full' ref={reactFlowWrapper}>
      {/*  */}
      {/*  */}

      {currentAPI && (
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onConnectStart={onConnectStart}
          onConnectEnd={onConnectEnd}
          fitView
          fitViewOptions={fitViewOptions}
          nodeTypes={NodeTypes}
          snapToGrid>
          <OnSpace nodes={nodes} edges={edges}></OnSpace>
          <MiniMap style={minimapStyle} zoomable pannable />
          <Controls />
          <Background color='#222222' gap={25} />
        </ReactFlow>
      )}

      {/*  */}
      <div
        style={{ position: 'absolute', top: `${toolTop}`, left: `${toolLeft}`, display: showTool ? 'block' : 'none' }}
        ref={mousePopChooser}>
        {currentAPI && <PopChooser api={currentAPI} nodes={nodes} guiRef={mousePopChooser}></PopChooser>}
      </div>

      {/*  */}
      {/*  */}
      <div className=' absolute top-0 left-0 z-20 p-2'>
        <button
          onClick={() => {
            const DemoEdges = [
              { id: 'e1-2', source: '1', target: '2' },
              { id: 'e2-3', source: '2', target: '3' },
            ]

            const DemoNodes = [
              {
                id: '1',
                type: 'ColorChooserNode',
                data: { label: 'node1', color: '#4FD1C5' },
                position: { x: 250, y: 25 },
              },

              {
                id: '2',
                type: 'ColorChooserNode',
                data: { label: 'node2', color: '#F6E05E' },
                position: { x: 100, y: 125 },
              },
              {
                id: '3',
                type: 'ColorChooserNode',
                data: { label: 'node3', color: '#B794F4' },
                position: { x: 250, y: 250 },
              },
            ]

            currentAPI.doc.getArray('nodes').delete(0, currentAPI.doc.getArray('nodes').length)
            currentAPI.doc.getArray('edges').delete(0, currentAPI.doc.getArray('edges').length)

            currentAPI.doc.getArray('nodes').push(DemoNodes)
            currentAPI.doc.getArray('edges').push(DemoEdges)
          }}>
          reset default
        </button>
      </div>
    </div>
  )
}

export default function Page() {
  //
  return (
    <ReactFlowProvider>
      <div className='relative w-full h-full'>
        <Flow></Flow>
      </div>
    </ReactFlowProvider>
  )
}
