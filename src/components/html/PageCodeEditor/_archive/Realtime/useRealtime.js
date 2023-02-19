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

function toArray(map) {
  let arr = []
  for (let item of map.values()) {
    arr.push(item)
  }
  return arr
}

export const useRealtime = create((set, get) => {
  return {
    doc: false,
    rootManager: false,
    nodes: [],
    edges: [],
    onOpen: ({ roomName, docName }) => {
      let doc = new Y.Doc()

      const rootManager = new Y.UndoManager([doc.getMap('nodes'), doc.getMap('edges')])

      let hh = (ev) => {
        if (ev.metaKey && ev.shiftKey && ev.key === 'z') {
          rootManager.redo()
        } else if (ev.metaKey && ev.key === 'z') {
          rootManager.undo()
        }
      }
      window.addEventListener('keydown', hh)

      set({
        rootManager,
        doc: doc,
      })

      const provider = new IndexeddbPersistence(docName, doc)

      provider.on('synced', () => {
        set({
          //
          nodes: toArray(doc.getMap('nodes')),
          edges: toArray(doc.getMap('edges')),
        })
      })

      return () => {
        provider.destroy()
        window.removeEventListener('keydown', hh)
      }
    },

    saveRedo: () => {
      get().doc.transact(() => {
        let nodesMap = get().doc.getMap('nodes')
        let edgesMap = get().doc.getMap('edges')
        nodesMap.clear()
        edgesMap.clear()

        get().nodes.forEach((it) => {
          nodesMap.set(it.id, it)
        })
        get().edges.forEach((it) => {
          edgesMap.set(it.id, it)
        })
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
      setTimeout(() => {
        set({ showTool: false })
      })
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
    createModule: '',
    autoConnect: '',
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
