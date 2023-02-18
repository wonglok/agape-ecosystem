import { create } from 'zustand'
import * as Y from 'yjs'
import { addEdge, applyNodeChanges, applyEdgeChanges } from 'reactflow'
import { getID } from '@/backend/aws'
import { IndexeddbPersistence } from 'y-indexeddb'
// import { Object3D } from 'three'
// import { proxy } from 'valtio'
// import { bind } from 'valtio-yjs'
// import { v4 } from 'uuid'
// import { Observable } from 'lib0/observable'
// import { fromUint8Array, toUint8Array } from 'js-base64'

export const createNewDocument = () => new Y.Doc()

export const useRealtime = create((set, get) => {
  return {
    doc: false,
    nodes: [],
    edges: [],
    nodesAPI: [],
    edgesAPI: [],
    onOpen: ({ roomName, docName }) => {
      let doc = new Y.Doc()

      const forNode = new Y.UndoManager(doc.getArray('nodes'))
      const forEdges = new Y.UndoManager(doc.getArray('edges'))

      let hh = (ev) => {
        if (ev.metaKey && ev.shiftKey && ev.key === 'z') {
          forNode.redo()
          forEdges.redo()
        } else if (ev.metaKey && ev.key === 'z') {
          forNode.undo()
          forEdges.undo()
        }
      }
      window.addEventListener('keydown', hh)
      set({
        forNode,
        forEdges,
        doc: doc,
      })

      const provider = new IndexeddbPersistence(docName, doc)

      provider.on('synced', () => {
        let nodes = doc.getArray('nodes').toArray()
        let edges = doc.getArray('edges').toArray()
        set({ edges, nodes })
      })

      return () => {
        provider.destroy()
        window.removeEventListener('keydown', hh)
      }
    },
    mapToArray: (name) => {
      let yesMap = get().doc.getMap(name)
      let myArr = []
      yesMap.forEach((it) => {
        myArr.push(it)
      })
      return myArr
    },

    saveRedo: () => {
      get().doc.transact(() => {
        get().doc.getArray('nodes').delete(0, get().doc.getArray('nodes').length)
        get().doc.getArray('nodes').insert(0, get().nodes)

        get().doc.getArray('edges').delete(0, get().doc.getArray('edges').length)
        get().doc.getArray('edges').insert(0, get().edges)
      })
    },
    onNodesChange: (changes) => {
      let newNodes = applyNodeChanges(changes, get().nodes)

      set({ nodes: newNodes })

      get().saveRedo()
    },

    onEdgesChange: (changes) => {
      let latest = applyEdgeChanges(changes, get().edges)

      set({ edges: latest })

      get().saveRedo()
    },

    onConnect: (connection) => {
      let latest = addEdge(connection, get().edges)

      set({ edges: latest })
      get().saveRedo()
      set({ showTool: false })
    },

    updateNodeLabel: (nodeId, label) => {
      let latest = get().nodes.map((node) => {
        if (node.id === nodeId) {
          node.data = { ...node.data, label }
        }
        return node
      })

      set({ nodes: latest })
      get().saveRedo()
    },
    updateNodeColor: (nodeId, color) => {
      let latest = get().nodes.map((node) => {
        if (node.id === nodeId) {
          node.data = { ...node.data, color }
        }
        return node
      })

      set({ nodes: latest })
      get().saveRedo()
    },

    showTool: false,
    toolTop: '0px',
    toolLeft: '0px',
    newNodePos: { x: 0, y: 0 },
    hand: { nodeId: '', handleType: '', handleId: '' },
    onAddNode: (payload) => {
      // //
      const id = getID()
      const newNode = payload
      newNode.id = id
      newNode.position = get().newNodePos
      let newEdge = {
        id: getID(),
        source: get().hand?.nodeId,
        sourceHandle: 'out0',
        targetHandle: 'in1',
        target: id,
      }

      let edges = get().edges
      edges.push(newEdge)
      let nodes = get().nodes
      nodes.push(newNode)
      set({ edges: [...edges], nodes: [...nodes] })
      set({ showTool: false })
    },
    onConnectNode: (payload) => {
      let newEdgeID = getID()
      let newEdge = {
        id: newEdgeID,
        source: get().hand?.nodeId,
        sourceHandle: 'out0',
        targetHandle: 'in1',
        target: payload.id,
      }
      let edges = get().edges
      edges.push(newEdge)
      set({ edges: [...edges] })
      set({ showTool: false })
    },
  }
})

export let getYArrayIndex = (yArray, item) => {
  let idx = -1
  yArray.forEach((it, idxx) => {
    if (it.id === item.id) {
      idx = idxx
    }
  })
  return idx
}
