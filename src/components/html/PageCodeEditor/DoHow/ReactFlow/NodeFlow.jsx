import React, { useCallback, useEffect, useRef, useState } from 'react'
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  ReactFlowProvider,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  useReactFlow,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { NodeTypes } from './NodeTypes'
// import { AWSData, getID } from '@/backend/aws'
import { createRealTime, getYArrayIndex, useRealtime } from '../Realtime/useRealtime'
import { PopChooser } from './PopChooser/PopChooser'
import { OnSpace } from './Keyboard/OnSpace'
import * as Y from 'yjs'
// import { useFrame } from '@react-three/fiber'
// import { useYArray, useYDoc } from 'zustand-yjs'

// const selector = (state) => ({
//   nodes: state.nodes,
//   edges: state.edges,
//   onNodesChange: state.onNodesChange,
//   onEdgesChange: state.onEdgesChange,
//   onConnect: state.onConnect,
// })

function Flow() {
  return <div className='w-full h-full'>{<CoreImple></CoreImple>}</div>
}

// let useYArray = (doc, name) => {
//   let [data, setDataAPI] = useState([])

//   useEffect(() => {
//     let yArray = doc.getArray(name)
//     let hh = () => {
//       setDataAPI(yArray.toArray())
//     }
//     yArray.observe(hh)
//     return () => {
//       yArray.unobserve(hh)
//     }
//   }, [doc, name])

//   return data
// }

function CoreImple({}) {
  let nodes = useRealtime((s) => {
    return s.nodes
  })
  let edges = useRealtime((s) => {
    return s.edges
  })
  let doc = useRealtime((s) => {
    return s.doc
  })

  let onNodesChange = useRealtime((r) => r.onNodesChange)
  let onEdgesChange = useRealtime((r) => r.onEdgesChange)
  let onConnect = useRealtime((r) => r.onConnect)

  useEffect(() => {
    return useRealtime.getState().onOpen({ roomName: 'r1', documentName: 'd10' })
  }, [])

  useEffect(() => {}, [])
  /** @type {Y.Doc} */

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

  const onConnectStart = useCallback((_, { nodeId }) => {
    // connectingNodeId.current = nodeId
    useRealtime.setState({ connectingNodeId: nodeId })
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

            useRealtime.getState().applyMapToServer('nodes', DemoNodes)
            useRealtime.getState().applyMapToServer('edges', DemoEdges)

            // latest.forEach((it) => {
            //   core.rootState.nodes.push({ ...it })
            // })
            // core.rootState.edges = JSON.parse(JSON.stringify(DemoEdges))
          }}>
          reset default
        </button>
      </div>

      <div className='w-full h-full' ref={reactFlowWrapper}>
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
      </div>
      <div
        style={{ position: 'absolute', top: `${toolTop}`, left: `${toolLeft}`, display: showTool ? 'block' : 'none' }}
        ref={mousePopChooser}>
        {<PopChooser nodes={nodes} guiRef={mousePopChooser}></PopChooser>}
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
