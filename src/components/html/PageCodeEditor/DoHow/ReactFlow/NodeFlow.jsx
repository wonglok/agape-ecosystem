import React, { useEffect, useState } from 'react'
import ReactFlow from 'reactflow'
import { shallow } from 'zustand/shallow'

import 'reactflow/dist/style.css'

import { NodeTypes } from './NodeTypes'
import { DemoNodes } from './nodes'
import { DemoEdges } from './edges'
import { useFlowStore } from './useFlowStore'
import { AWSData } from '@/backend/aws'
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
    //
    let api = provideAPI({ token: AWSData.jwt, rooomName: 'room', documentName: 'doc3' })
    setAPI(api)

    let syncAttr = (attrName = 'nodes') => {
      let mapObject = api.doc.getMap(attrName)
      mapObject.observe(() => {
        //
        let arr = []
        for (let item of mapObject.values()) {
          arr.push(item)
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
            }, 25)
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
  }, [provideAPI])
  return (
    <>
      <button
        onClick={() => {
          DemoNodes.forEach((it) => {
            api.doc.getMap('nodes').set(it.id, it)
          })
          DemoEdges.forEach((it) => {
            api.doc.getMap('edges').set(it.id, it)
          })

          //
          // api.doc.getMap('nodes').push([...DemoNodes])
          // api.doc.getMap('edges').push([...DemoEdges])
        }}>
        add
      </button>

      {
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={NodeTypes}
          fitView></ReactFlow>
      }
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
