import { create } from 'zustand'
import { addEdge, applyNodeChanges, applyEdgeChanges } from 'reactflow'
import { useRealtime } from '../Realtime/useRealtime'

// this is our useFlowStore hook that we can use in our components to get parts of the store and call actions
const useFlowStore = create((set, get) => {
  return {
    nodes: [],
    edges: [],
    api: false,
    isSelf: 0,
    onNodesChange: (changes) => {
      let latest = applyNodeChanges(changes, get().nodes)

      set({
        nodes: [...latest],
      })

      useRealtime.getState().applyFlow('nodes', [...latest])
    },
    onEdgesChange: (changes) => {
      edges = get().edges
      edges = applyEdgeChanges(changes, edges)
      set({
        edges: [...edges],
      })
      useRealtime.getState().applyFlow('edges', [...edges])
    },
    onConnect: (connection) => {
      let edges = addEdge(connection, get().edges)
      set({
        edges: [...edges],
      })
      useRealtime.getState().applyFlow('edges', [...edges])
    },
    //
    updateNodeLabel: (nodeId, label) => {
      set({
        nodes: get().nodes.map((node) => {
          if (node.id === nodeId) {
            //
            // it's important to create a new object here, to inform React Flow about the cahnges
            node.data = { ...node.data, label }
          }

          return node
        }),
      })
    },
    updateNodeColor: (nodeId, color) => {
      set({
        nodes: get().nodes.map((node) => {
          if (node.id === nodeId) {
            //
            // it's important to create a new object here, to inform React Flow about the cahnges
            node.data = { ...node.data, color }
          }

          return node
        }),
      })
    },
  }
})

export { useFlowStore }
