import { addEdge, applyEdgeChanges, applyNodeChanges } from 'reactflow'
import { create } from 'zustand'
import * as Y from 'yjs'
import { IndexeddbPersistence } from 'y-indexeddb'
import { getID } from '@/backend/aws'
import { nodeTypeList } from './nodeTypes'

function toArray(map) {
  let arr = []
  for (let item of map.values()) {
    arr.push(item)
  }
  return arr
}

export const useFlow = create((set, get) => {
  return {
    //
    ready: null,
    nodes: [],
    edges: [],
    doc: false,
    openFile: ({ docName }) => {
      let doc = new Y.Doc()
      set({ doc })
      const rootManager = new Y.UndoManager([doc.getMap('nodes'), doc.getMap('edges')])

      let hh = (ev) => {
        if (ev.metaKey && ev.shiftKey && ev.key === 'z') {
          rootManager.redo()
        } else if (ev.metaKey && ev.key === 'z') {
          rootManager.undo()
        }
      }
      window.addEventListener('keydown', hh)

      const provider = new IndexeddbPersistence(docName, doc)

      let sync = () => {
        set({
          //
          nodes: toArray(doc.getMap('nodes')),
          edges: toArray(doc.getMap('edges')),
        })
      }
      provider.whenSynced.then(() => {
        sync()
      })
      rootManager.on('stack-item-popped', sync)

      return () => {
        rootManager.off('stack-item-popped', sync)
        provider.destroy()
        window.removeEventListener('keydown', hh)
      }
    },
    saveToDB: () => {
      setTimeout(() => {
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
      })
    },
    onNodesChange: (changes) => {
      set({
        nodes: applyNodeChanges(changes, get().nodes),
      })
      get().saveToDB()
    },
    onEdgesChange: (changes) => {
      set({
        edges: applyEdgeChanges(changes, get().edges),
      })
      get().saveToDB()
    },
    onConnect: (connection) => {
      set({
        edges: addEdge(connection, get().edges),
      })
      get().saveToDB()
    },

    selectedNodes: [],
    selectedEdges: [],
    hand: {
      node: false,
      nodeType: '',
      nodeId: '',
      handleType: '',
      handleId: '',
    },
    showTool: false,
    toolTop: `0px`,
    toolLeft: `0px`,
    newNodePos: { x: 0, y: 0 },

    //!SECTION
    connHelperAction: '',
    createModuleName: '',
    autoConnectName: '',
    connectModuleName: '',
    ///
    onConnectEnd:
      ({ reactFlowWrapper, project }) =>
      (event) => {
        const targetIsPane = event.target.classList.contains('react-flow__pane')

        if (targetIsPane) {
          // we need to remove the wrapper bounds, in order to get the correct position
          const { top, left } = reactFlowWrapper.current.getBoundingClientRect()

          set({
            showTool: true,
            toolTop: `${event.clientY - top}px`,
            toolLeft: `${event.clientX - left}px`,
            newNodePos: project({ x: event.clientX - left, y: event.clientY - top - 10 }),
          })
        } else {
          set({
            showTool: false,
          })
        }

        get().saveToDB()
      },
    onConnectStart: (_, info) => {
      set({
        hand: {
          node: get().nodes.find((n) => {
            return n.id === info.nodeId
          }),
          nodeType:
            get().nodes.find((n) => {
              return n.id === info.nodeId
            })?.type || '',
          nodeId: info.nodeId,
          handleType: info.handleType,
          handleId: info.handleId,
        },
      })
      get().saveToDB()
    },
    updateNodeColor: (nodeId, color) => {
      set({
        nodes: get().nodes.map((node) => {
          if (node.id === nodeId) {
            node.data = { ...node.data, color }
          }
          return node
        }),
      })
      get().saveToDB()
    },
    updateNodeLabel: (nodeId, label) => {
      set({
        nodes: get().nodes.map((node) => {
          if (node.id === nodeId) {
            node.data = { ...node.data, label }
          }
          return node
        }),
      })
      get().saveToDB()
    },

    onAddNode: () => {
      const id = getID()
      const newNode = nodeTypeList?.find((r) => r.type === get()?.createModuleName)?.createData()
      newNode.id = id
      newNode.position = get().newNodePos

      if (get()?.hand?.handleType === 'source') {
        let newEdge = {
          id: getID(),
          source: get().hand?.nodeId,
          sourceHandle: get().hand.handleId,
          targetHandle: get().autoConnectName,
          target: id,
        }
        let edges = get().edges
        edges.push(newEdge)
        let nodes = get().nodes
        nodes.push(newNode)
        set({ edges: [...edges], nodes: [...nodes] })
      } else if (get()?.hand?.handleType === 'target') {
        let newEdge = {
          id: getID(),
          source: id,
          sourceHandle: get().autoConnectName,
          targetHandle: get().hand.handleId,
          target: get().hand?.nodeId,
        }

        let edges = get().edges
        edges.push(newEdge)
        let nodes = get().nodes
        nodes.push(newNode)
        set({ edges: [...edges], nodes: [...nodes] })
      }

      get().saveToDB()
      setTimeout(() => {
        set({
          showTool: false,
          hand: {
            node: false,
            nodeType: '',
            nodeId: '',
            handleType: '',
            handleId: '',
          },
        })
        set({ connHelperAction: '', createModuleName: '', autoConnectName: '' })
      })
    },

    resetDemo: () => {
      set({
        nodes: [
          {
            id: '1',
            type: 'ColorPicker',
            data: { label: 'node1', color: '#4FD1C5' },
            position: { x: 250, y: 25 },
          },
        ],
      })
      get().saveToDB()
    },
  }
})
