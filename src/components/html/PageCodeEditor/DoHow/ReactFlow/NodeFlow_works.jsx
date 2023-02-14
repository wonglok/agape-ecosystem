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
    return makeCurrent({ roomName: 'room', documentName: 'doc8' })
  }, [makeCurrent])

  useEffect(() => {
    if (!currentAPI) {
      return
    }
    try {
      let cleans = []

      let syncAttr = (attrName = 'nodes') => {
        let mapObject = currentAPI.doc.getMap(attrName)

        let hh = () => {
          //
          let arr = []
          for (let item of mapObject.values()) {
            arr.push({ ...item })
          }

          useFlowStore.setState({ [attrName]: arr })
        }
        mapObject.observe(hh)
        cleans.push(() => {
          mapObject.unobserve(hh)
        })
      }

      syncAttr('nodes')
      syncAttr('edges')

      let autoUpload = (attrName) => {
        let tt = 0

        cleans.push(
          useFlowStore.subscribe((state, before) => {
            //prevent over compute
            if (state.isSelf !== before.isSelf) {
              clearTimeout(tt)
              tt = setTimeout(() => {
                let array = useFlowStore.getState()[attrName]
                let mapObject = currentAPI.doc.getMap(attrName)

                // array.forEach((it) => {
                //   let jsonFromCloud = JSON.stringify(mapObject.get(it.id))
                //   let jsonLatest = JSON.stringify(it)
                //   if (jsonFromCloud !== jsonLatest) {
                //     mapObject.set(it.id, it)
                //   }
                // })

                mapObject.clear()
                array.forEach((it) => {
                  mapObject.set(it.id, it)
                })
              }, 50)
            }
          }),
        )
      }

      autoUpload('nodes')
      autoUpload('edges')

      return () => {
        currentAPI.clean()
        cleans.forEach((r) => r())
      }
    } catch (e) {
      console.error(e)
    }
  }, [currentAPI])

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
    connectingNodeId.current = nodeId
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

        mousePopChooser.current.style.top = `${event.clientY - top}px`
        mousePopChooser.current.style.left = `${event.clientX - left}px`
        mousePopChooser.current.style.display = 'block'

        let newEdgeID = getID()
        mousePopChooser.current.onConnectNode = (payload) => {
          let newEdge = { id: newEdgeID, source: connectingNodeId.current, target: payload.id }

          currentAPI.doc.getMap('edges').set(newEdge.id, newEdge)

          mousePopChooser.current.style.display = 'none'
        }
        mousePopChooser.current.onAddNode = (payload) => {
          //
          const id = getID()

          const newNode = payload
          newNode.id = id
          newNode.position = project({ x: event.clientX - left, y: event.clientY - top - 10 })

          currentAPI.doc.getMap('nodes').set(newNode.id, newNode)

          let newEdge = { id: getID(), source: connectingNodeId.current, target: id }
          currentAPI.doc.getMap('edges').set(newEdge.id, newEdge)

          mousePopChooser.current.style.display = 'none'
        }
      }
    },
    [currentAPI, project],
  )

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
          <Background color='#aaaaaa' gap={10} />
        </ReactFlow>
      )}

      {/*  */}
      {/*  */}
      {/*  */}
      <div style={{ position: 'absolute', top: `0px`, left: `0px`, display: 'none' }} ref={mousePopChooser}>
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

            currentAPI.doc.getMap('nodes').clear()
            currentAPI.doc.getMap('edges').clear()
            DemoNodes.forEach((it) => {
              currentAPI.doc.getMap('nodes').set(it.id, it)
            })
            DemoEdges.forEach((it) => {
              currentAPI.doc.getMap('edges').set(it.id, it)
            })
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