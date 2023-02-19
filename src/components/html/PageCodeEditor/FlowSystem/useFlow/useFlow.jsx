import { addEdge, applyEdgeChanges, applyNodeChanges } from 'reactflow'
import { create } from 'zustand'
import * as Y from 'yjs'
import { IndexeddbPersistence } from 'y-indexeddb'
import { nodeTemplateList } from './nodeTypes'
import { getID } from '@/backend/aws'

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

      provider.on('synced', () => {
        set({
          //
          nodes: toArray(doc.getMap('nodes')),
          edges: toArray(doc.getMap('edges')),
          ready: true,
          doc: doc,
        })
      })

      let cancelFlow = useFlow.subscribe((st, b4) => {
        if (st.edges !== b4.edges) {
          get().saveToDB()
        }
        if (st.nodes !== b4.nodes) {
          get().saveToDB()
        }
      })

      return () => {
        cancelFlow()
        provider.destroy()
        window.removeEventListener('keydown', hh)
      }
    },
    saveToDB: () => {
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
      set({
        nodes: applyNodeChanges(changes, get().nodes),
      })
    },
    onEdgesChange: (changes) => {
      set({
        edges: applyEdgeChanges(changes, get().edges),
      })
    },
    onConnect: (connection) => {
      set({
        edges: addEdge(connection, get().edges),
      })
    },

    selectedNodes: [],
    selectedEdges: [],
    hand: {
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

        //
      },
    onConnectStart: (_, info) => {
      set({
        hand: {
          //
          nodeId: info.nodeId,
          handleType: info.handleType,
          handleId: info.handleId,
        },
      })
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
    },

    onAddNode: () => {
      // //
      const id = getID()
      const newNode = nodeTemplateList.find((r) => r.type === get().createModuleName).module.createData()
      newNode.id = id
      newNode.position = get().newNodePos

      if (get().hand.handleType === 'source') {
        let newEdge = {
          id: getID(),
          source: get().hand?.nodeId,
          sourceHandle: get().hand.handleId,
          targetHandle: get().autoConnect,
          target: id,
        }
        let edges = get().edges
        edges.push(newEdge)

        let nodes = get().nodes
        nodes.push(newNode)
        set({ edges: [...edges], nodes: [...nodes] })
      } else if (get().hand.handleType === 'target') {
        let newEdge = {
          id: getID(),
          source: id,
          sourceHandle: get().autoConnect,
          targetHandle: get().hand.handleId,
          target: get().hand?.nodeId,
        }

        let edges = get().edges
        edges.push(newEdge)

        let nodes = get().nodes
        nodes.push(newNode)
        set({ edges: [...edges], nodes: [...nodes] })
      }
      set({ showTool: false })
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
    },
  }
})
