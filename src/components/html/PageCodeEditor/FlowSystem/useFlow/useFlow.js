import { addEdge, applyEdgeChanges, applyNodeChanges } from 'reactflow'
import { create } from 'zustand'
// import * as Y from 'yjs'
// import { IndexeddbPersistence } from 'y-indexeddb'
import { getID } from '@/backend/aws'
import { nodeTypeList } from './nodeTypes'
import Worker from 'worker-loader!./Worker.js'
import nProgress from 'nprogress'

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
    fitView: () => {},
    openFile: ({ docName }) => {
      let hh = (ev) => {
        if (ev.metaKey && ev.shiftKey && ev.key === 'z') {
          worker.postMessage({ type: 'redo' })
        } else if (ev.metaKey && ev.key === 'z') {
          worker.postMessage({ type: 'undo' })
        }
      }
      window.addEventListener('keydown', hh)

      let sync = ({ nodes, edges }) => {
        set({
          nodes: nodes,
          edges: edges,
        })
      }

      let worker = new Worker()

      worker.addEventListener('message', (ev) => {
        if (ev.data.type === 'sync') {
          sync({
            nodes: ev.data.nodes,
            edges: ev.data.edges,
          })
          nProgress.done()
        }
      })
      nProgress.start()
      worker.postMessage({ type: 'load', docName })

      set({
        saveToDB: () => {
          worker.postMessage({ type: 'saveDB', nodes: get().nodes, edges: get().edges })
        },
      })
      return () => {
        window.removeEventListener('keydown', hh)
        worker.terminate()
      }
    },
    saveToDB: () => {},
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
      setTimeout(() => {
        set({
          showTool: false,
        })
      })
    },
    onConnect: (connection) => {
      connection.type = 'CloseEdge'
      set({
        edges: addEdge(connection, get().edges),
      })
      get().saveToDB()
      setTimeout(() => {
        set({
          showTool: false,
        })
      })
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
    remoteHandleName: '',
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
        get().fitToView()
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
    updateNodeData: (nodeId, prop, value) => {
      set({
        nodes: get().nodes.map((node) => {
          if (node.id === nodeId) {
            node.data = { ...node.data, [prop]: value }
          }
          return node
        }),
      })
      get().saveToDB()
    },

    //
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
          targetHandle: get().remoteHandleName,
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
          sourceHandle: get().remoteHandleName,
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
        set({ connHelperAction: '', createModuleName: '', remoteHandleName: '' })
      })
    },

    onAddEdge: () => {
      //

      let nodeId = get().hand.nodeId
      let nodeHandle = get().hand.handleId
      let handleType = get().hand.handleType

      if (handleType === 'source') {
        let newEdge = {
          id: getID(),
          source: nodeId,
          sourceHandle: nodeHandle,
          target: get().connectModuleID,
          targetHandle: get().remoteHandleName,
          type: 'CloseEdge',
        }

        let edges = get().edges
        edges.push(newEdge)
        set({ edges: [...edges] })
      } else {
        let newEdge = {
          id: getID(),
          target: nodeId,
          targetHandle: nodeHandle,
          source: get().connectModuleID,
          sourceHandle: get().remoteHandleName,
          type: 'CloseEdge',
        }

        let edges = get().edges
        edges.push(newEdge)
        set({ edges: [...edges] })
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
        set({ connHelperAction: '', connectModuleID: '', remoteHandleName: '' })
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
