import React, { useCallback, useEffect, useRef } from 'react'
import ReactFlow, { Background, Controls, MiniMap, ReactFlowProvider, useReactFlow } from 'reactflow'
import 'reactflow/dist/style.css'
import { NodeTypes } from './NodeTypes'
// import { AWSData, getID } from '@/backend/aws'
import { useRealtime } from '../Realtime/useRealtime'
import { PopChooser } from './PopChooser/PopChooser'
import { OnSpace } from './Keyboard/OnSpace'
import * as Y from 'yjs'
import { getID } from '@/backend/aws'

function Flow() {
  return <div className='w-full h-full'>{<CoreImple></CoreImple>}</div>
}

function CoreImple({}) {
  let nodes = useRealtime((s) => {
    return s.nodes
  })
  let edges = useRealtime((s) => {
    return s.edges
  })

  let onNodesChange = useRealtime((r) => r.onNodesChange)
  let onEdgesChange = useRealtime((r) => r.onEdgesChange)
  let onConnect = useRealtime((r) => r.onConnect)

  useEffect(() => {
    return useRealtime.getState().onOpen({ roomName: 'r1', docName: 'd19' })
  }, [])

  let minimapStyle = {}

  let { showTool, toolTop, toolLeft } = useRealtime((r) => ({
    toolTop: r.toolTop,
    toolLeft: r.toolLeft,
    showTool: r.showTool,
  }))

  const { project } = useReactFlow()

  const fitViewOptions = {
    padding: 1,
  }

  let reactFlowWrapper = useRef()
  let mousePopChooser = useRef()

  const onConnectStart = useCallback((_, info) => {
    useRealtime.setState({
      hand: {
        //
        nodeId: info.nodeId,
        handleType: info.handleType,
        handleId: info.handleId,
      },
    })
  }, [])

  const onConnectEnd = useCallback(
    (event) => {
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
      } else {
        useRealtime.setState({
          showTool: false,
        })
      }
    },
    [project],
  )

  return (
    <>
      <div className='w-full h-full' ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onConnectStart={onConnectStart}
          onConnectEnd={onConnectEnd}
          onDragEnd={() => {
            useRealtime.getState().saveRedo()
          }}
          fitView
          fitViewOptions={fitViewOptions}
          nodeTypes={NodeTypes}
          snapToGrid>
          <OnSpace nodes={nodes} edges={edges}></OnSpace>
          <MiniMap style={minimapStyle} zoomable pannable />
          <Controls />
          <Background color='#222222' gap={25} />
          <Controls />
        </ReactFlow>
      </div>
      <div
        style={{ position: 'absolute', top: `${toolTop}`, left: `${toolLeft}`, display: showTool ? 'block' : 'none' }}
        ref={mousePopChooser}>
        {/* {<PopChooser nodes={nodes} guiRef={mousePopChooser}></PopChooser>} */}
      </div>
    </>
  )
}

export default function Page() {
  //
  return (
    <ReactFlowProvider>
      <div className='relative w-full h-full'>
        <Flow></Flow>
        <div className=' absolute top-0 left-0 z-20 p-2'>
          <button
            onClick={() => {
              const DemoEdges = [
                { id: getID(), source: '1', sourceHandle: 'source0', targetHandle: 'target0', target: '2' },
                { id: getID(), source: '2', sourceHandle: 'source1', targetHandle: 'target1', target: '3' },
              ]

              const DemoNodes = [
                {
                  id: '1',
                  type: 'ColorPickerNode',
                  data: { label: 'node1', color: '#4FD1C5' },
                  position: { x: 250, y: 25 },
                },

                {
                  id: '2',
                  type: 'ColorPickerNode',
                  data: { label: 'node2', color: '#F6E05E' },
                  position: { x: 100, y: 125 },
                },
                {
                  id: '3',
                  type: 'ColorPickerNode',
                  data: { label: 'node3', color: '#B794F4' },
                  position: { x: 250, y: 250 },
                },
              ]

              useRealtime.setState({
                nodes: JSON.parse(JSON.stringify(DemoNodes)),
                edges: JSON.parse(JSON.stringify(DemoEdges)),
              })
            }}>
            reset default
          </button>
        </div>
      </div>
    </ReactFlowProvider>
  )
}

//
// let makeCurrent = useRealtime((s) => s.makeCurrent)
// let currentAPI = useRealtime((s) => s.currentAPI)

// const { nodes, edges, onNodesChange, onEdgesChange, onConnect } = useFlowStore(selector, shallow)
// useEffect(() => {
//   return makeCurrent({ roomName: 'room', documentName: 'v102' })
// }, [makeCurrent])

// const minimapStyle = {
//   height: 120,
// }
// // const connectingNodeId = useRef(null)
// const { project } = useReactFlow()

// const fitViewOptions = {
//   padding: 1,
// }

// let reactFlowWrapper = useRef()
// let mousePopChooser = useRef()

// // const onConnect2 = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [])

// const onConnectStart = useCallback((_, { nodeId }) => {
//   // connectingNodeId.current = nodeId
//   useRealtime.setState({ connectingNodeId: nodeId })
// }, [])

// const onConnectEnd = useCallback(
//   (event) => {
//     if (!currentAPI) {
//       return
//     }

//     const targetIsPane = event.target.classList.contains('react-flow__pane')

//     if (targetIsPane) {
//       // we need to remove the wrapper bounds, in order to get the correct position
//       const { top, left } = reactFlowWrapper.current.getBoundingClientRect()

//       useRealtime.setState({
//         showTool: true,
//         toolTop: `${event.clientY - top}px`,
//         toolLeft: `${event.clientX - left}px`,
//         newNodePos: project({ x: event.clientX - left, y: event.clientY - top - 10 }),
//       })

//       // mousePopChooser.current.
//       // mousePopChooser.current
//     }
//   },
//   [currentAPI, project],
// )

// let { showTool, toolTop, toolLeft } = useRealtime((r) => ({
//   toolTop: r.toolTop,
//   toolLeft: r.toolLeft,
//   showTool: r.showTool,
// }))

// return (
//   <div className='w-full h-full' ref={reactFlowWrapper}>
//     {/*  */}
//     {/*  */}

//     {currentAPI && (
//       <ReactFlow
//         nodes={nodes}
//         edges={edges}
//         onNodesChange={onNodesChange}
//         onEdgesChange={onEdgesChange}
//         onConnect={onConnect}
//         onConnectStart={onConnectStart}
//         onConnectEnd={onConnectEnd}
//         fitView
//         fitViewOptions={fitViewOptions}
//         nodeTypes={NodeTypes}
//         snapToGrid>
//         <OnSpace nodes={nodes} edges={edges}></OnSpace>
//         <MiniMap style={minimapStyle} zoomable pannable />
//         <Controls />
//         <Background color='#222222' gap={25} />
//       </ReactFlow>
//     )}

//     {/*  */}

//     {/*  */}
//     {/*  */}
//     <div className=' absolute top-0 left-0 z-20 p-2'>
//       <button
//         onClick={() => {
//           const DemoEdges = [
//             { id: 'e1-2', source: '1', target: '2' },
//             { id: 'e2-3', source: '2', target: '3' },
//           ]

//           const DemoNodes = [
//             {
//               id: '1',
//               type: 'ColorChooserNode',
//               data: { label: 'node1', color: '#4FD1C5' },
//               position: { x: 250, y: 25 },
//             },

//             {
//               id: '2',
//               type: 'ColorChooserNode',
//               data: { label: 'node2', color: '#F6E05E' },
//               position: { x: 100, y: 125 },
//             },
//             {
//               id: '3',
//               type: 'ColorChooserNode',
//               data: { label: 'node3', color: '#B794F4' },
//               position: { x: 250, y: 250 },
//             },
//           ]

//           currentAPI.doc.getMap('nodes').clear()
//           currentAPI.doc.getMap('edges').clear()

//           DemoNodes.map((it) => {
//             currentAPI.doc.getMap('nodes').set(it.id, it)
//           })
//           DemoEdges.map((it) => {
//             currentAPI.doc.getMap('edges').set(it.id, it)
//           })
//         }}>
//         reset default
//       </button>
//     </div>
//   </div>
// )
