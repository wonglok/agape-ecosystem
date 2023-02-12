import { create } from 'zustand'
import { addEdge, applyNodeChanges, applyEdgeChanges } from 'reactflow'

// this is our useFlowStore hook that we can use in our components to get parts of the store and call actions
const useFlowStore = create((set, get) => {
  return {
    nodes: [],
    edges: [],

    onNodesChange: (changes) => {
      let latest = applyNodeChanges(changes, get().nodes)

      set({
        nodes: latest,
        uploadSignal: Math.random(),
      })
    },
    onEdgesChange: (changes) => {
      set({
        edges: applyEdgeChanges(changes, get().edges),
        uploadSignal: Math.random(),
      })
      //
    },
    onConnect: (connection) => {
      set({
        edges: addEdge(connection, get().edges),
        uploadSignal: Math.random(),
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

        uploadSignal: Math.random(),
      })
    },
  }
})

export { useFlowStore }
