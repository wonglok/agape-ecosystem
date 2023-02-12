import React, { useCallback, useEffect, useRef, useState } from 'react'
import ReactFlow, { Background, Controls, MiniMap, ReactFlowProvider, useReactFlow } from 'reactflow'
import { shallow } from 'zustand/shallow'

import 'reactflow/dist/style.css'

import { NodeTypes } from './NodeTypes'
import { useFlowStore } from './useFlowStore'
import { AWSData, getID } from '@/backend/aws'
import { useRealtime } from '../Realtime/useRealtime'

const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
})

function Flow() {
  let provideAPI = useRealtime((s) => s.provideAPI)

  let [api, setAPI] = useState(false)

  const { nodes, edges, onNodesChange, onEdgesChange, onConnect } = useFlowStore(selector, shallow)
  useEffect(() => {
    try {
      let api = provideAPI({ token: AWSData.jwt || '__', roomName: 'room', documentName: 'doc6' })
      setAPI(api)

      let syncAttr = (attrName = 'nodes') => {
        let mapObject = api.doc.getMap(attrName)
        mapObject.observe(() => {
          //
          let arr = []
          for (let item of mapObject.values()) {
            arr.push({ ...item })
          }

          useFlowStore.setState({ [attrName]: arr })
        })
      }

      syncAttr('nodes')
      syncAttr('edges')

      let cleans = []

      let autoUpload = (attrName) => {
        let tt = 0

        cleans.push(
          useFlowStore.subscribe((state, before) => {
            //prevent over compute
            if (state.uploadSignal !== before.uploadSignal) {
              let array = useFlowStore.getState()[attrName]
              let mapObject = api.doc.getMap(attrName)

              clearTimeout(tt)
              tt = setTimeout(() => {
                array.forEach((it) => {
                  let jsonFromCloud = JSON.stringify(mapObject.get(it.id))
                  let jsonLatest = JSON.stringify(it)
                  if (jsonFromCloud !== jsonLatest) {
                    mapObject.set(it.id, it)
                  }
                })

                array.forEach((it) => {
                  if (!mapObject.has(it.id)) {
                    mapObject.delete(it.id)
                  }
                })
              }, 50)
            }
          }),
        )
      }

      autoUpload('nodes')
      autoUpload('edges')

      return () => {
        api.clean()
        cleans.forEach((r) => r())
      }
    } catch (e) {
      console.error(e)
    }
  }, [provideAPI])

  const minimapStyle = {
    height: 120,
  }
  const connectingNodeId = useRef(null)
  const { project } = useReactFlow()

  const fitViewOptions = {
    padding: 1,
  }

  let reactFlowWrapper = useRef()

  // const onConnect2 = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [])

  const onConnectStart = useCallback((_, { nodeId }) => {
    connectingNodeId.current = nodeId
  }, [])

  const onConnectEnd = useCallback(
    (event) => {
      const targetIsPane = event.target.classList.contains('react-flow__pane')

      if (targetIsPane) {
        // we need to remove the wrapper bounds, in order to get the correct position
        const { top, left } = reactFlowWrapper.current.getBoundingClientRect()
        //
        const newNode = {
          id: getID(),
          // we are removing the half of the node width (75) to center the new node
          position: project({ x: event.clientX - left - 75, y: event.clientY - top }),
          data: { label: `Node ${id}` },
        }

        api.doc.getMap('nodes').set(newNode.id, newNode)

        let newEdge = { id: getID(), source: connectingNodeId.current, target: id }
        api.doc.getMap('edges').set(newEdge.id, newEdge)

        // setNodes((nds) => nds.concat(newNode))
        // setEdges((eds) => eds.concat())
      }
    },
    [api.doc, project],
  )

  return (
    <div className='w-full h-full' ref={reactFlowWrapper}>
      {
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
          <MiniMap style={minimapStyle} zoomable pannable />
          <Controls />
          <Background color='#aaa' gap={10} />
        </ReactFlow>
      }
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
                data: { color: '#4FD1C5' },
                position: { x: 250, y: 25 },
              },

              {
                id: '2',
                type: 'ColorChooserNode',
                data: { color: '#F6E05E' },
                position: { x: 100, y: 125 },
              },
              {
                id: '3',
                type: 'ColorChooserNode',
                data: { color: '#B794F4' },
                position: { x: 250, y: 250 },
              },
            ]

            api.doc.getMap('nodes').clear()
            api.doc.getMap('edges').clear()
            DemoNodes.forEach((it) => {
              api.doc.getMap('nodes').set(it.id, it)
            })
            DemoEdges.forEach((it) => {
              api.doc.getMap('edges').set(it.id, it)
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
