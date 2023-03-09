import { addEdge, applyEdgeChanges, applyNodeChanges } from 'reactflow'
import { create } from 'zustand'
// import * as Y from 'yjs'
// import { IndexeddbPersistence } from 'y-indexeddb'
import { getID } from '@/backend/aws'
import { nodeTypeList } from './nodeTypes'
import { AWSBackend } from 'aws.config'
// import Worker from 'worker-loader!./Worker.js'
// import nProgress from 'nprogress'
// import { addNode } from './Firebase'

// function toArray(map) {
//   let arr = []
//   for (let item of map.values()) {
//     arr.push(item)
//   }
//   return arr
// }

let fireSyncNodes = (changes, nodes) => {
  console.log(changes)

  if (changes.type === 'add') {
    let item = changes.item
  } else if (changes.type === 'reset') {
    let item = changes.item
  } else if (changes.type === 'remove') {
    let id = changes.id
  } else if (changes.type === 'dimensions') {
    let id = changes.id
  } else if (changes.type === 'position') {
    let id = changes.id
  } else if (changes.type === 'select') {
    let id = changes.id
  }
}

let fireSyncEdges = (changes, edges) => {
  console.log(changes)

  if (changes.type === 'add') {
    let item = changes.item
  } else if (changes.type === 'reset') {
    let item = changes.item
  } else if (changes.type === 'remove') {
    let id = changes.id
  } else if (changes.type === 'dimensions') {
    let id = changes.id
  } else if (changes.type === 'position') {
    let id = changes.id
  } else if (changes.type === 'select') {
    let id = changes.id
  }
}

let makeAuto = (itself) => {
  let self = itself || {}
  self.events = {}

  self.on = (event, listener) => {
    if (typeof self.events[event] !== 'object') {
      self.events[event] = []
    }

    self.events[event].push(listener)
  }

  self.off = (event, listener) => {
    let idx

    if (typeof self.events[event] === 'object') {
      idx = self.events[event].indexOf(listener)

      if (idx > -1) {
        self.events[event].splice(idx, 1)
      }
    }
  }

  self.emit = (event) => {
    let i,
      listeners,
      length,
      args = [].slice.call(arguments, 1)

    if (typeof self.events[event] === 'object') {
      listeners = self.events[event].slice()
      length = listeners.length

      for (i = 0; i < length; i++) {
        listeners[i].apply(self, args)
      }
    }
  }

  self.once = (event, listener) => {
    self.on(event, function g() {
      self.removeListener(event, g)
      listener.apply(self, arguments)
    })
  }
  return self
}

class WSAuto {
  constructor({ roomID, url }) {
    this.url = url
    this.roomID = roomID
    //
    let self = makeAuto(this)
    this.self = self

    this.send = (v) => {
      if (this.ws && this.ws.readyState === this.ws.OPEN) {
        this.ws.send(JSON.stringify(v))
      } else {
        let tt = setInterval(() => {
          if (this.ws && this.ws.readyState === this.ws.OPEN) {
            clearInterval(tt)
            this.ws.send(JSON.stringify(v))
          }
        })
      }
    }
    this.clean = () => {
      if (this.ws) {
        this.ws.close()
        this.ws.onerror = () => {}
        this.ws.onclose = () => {}
        this.ws = {
          close() {},
          onerror() {},
          onclose() {},
        }
      }
    }

    this.init = () => {
      let ws = new WebSocket(`${this.url}`)
      this.ws = ws

      ws.onopen = () => {
        //
        this.send({ action: 'joinRoom', payload: { roomID } })
        //
      }

      ws.onmessage = (ev) => {
        try {
          let data = JSON.parse(ev.data)
          console.log('message', data)

          self.emit(data.action, data.payload)
        } catch (e) {
          console.error(e)
        }
      }
      ws.onclose = () => {
        this.clean()
        console.log('closed, reconnecting in 10 seconds')
        setTimeout(() => {
          this.init()
        }, 1000 * 10)
      }
      ws.onerror = (err) => {
        console.error(err)
        this.clean()
        console.log('error, reconnecting in 10 seconds')
        setTimeout(() => {
          this.init()
        }, 1000 * 10)
      }
    }
    this.init()
  }
}
// addGraphDoc({ title: docName })

export const useFlow = create((set, get) => {
  //

  //
  return {
    //
    toolAddOnlyMode: false,
    viewport: { x: 0, y: 0, zoom: 1 },
    rect: { top: 0, left: 0, width: 1024, height: 1024 },
    ready: null,
    nodes: [],
    edges: [],
    fitView: () => {},
    openFile: ({ docName }) => {
      //
      //
      //

      let ws = new WSAuto({ roomID: docName, url: AWSBackend[process.env.NODE_ENV].ws })

      // let hh = (ev) => {
      //   if (ev.metaKey && ev.shiftKey && ev.key === 'z') {
      //     worker.postMessage({ type: 'redo' })
      //   } else if (ev.metaKey && ev.key === 'z') {
      //     worker.postMessage({ type: 'undo' })
      //   }
      // }
      // window.addEventListener('keydown', hh)

      // let sync = ({ nodes, edges }) => {
      //   set({
      //     nodes: nodes,
      //     edges: edges,
      //   })
      // }

      // let worker = new Worker()

      // let did = false
      // let initTemplate = () => {
      //   if (!did) {
      //     did = true

      //     fetch(`/date/2022-20-23/backup.json`)
      //       .then((r) => r.json())
      //       .then((dat) => {
      //         if (get().nodes.length === 0 && get().edges.length === 0) {
      //           set({ nodes: dat.nodes, edges: dat.edges })
      //         }
      //       })
      //   }
      // }
      // worker.addEventListener('message', (ev) => {
      //   if (ev.data.type === 'sync') {
      //     sync({
      //       nodes: ev.data.nodes,
      //       edges: ev.data.edges,
      //     })

      //     setTimeout(() => {
      //       initTemplate()
      //     })
      //     nProgress.done()
      //   }
      // })
      // nProgress.start()
      // worker.postMessage({ type: 'load', docName })

      set({
        saveToDB: () => {
          // worker.postMessage({ type: 'saveDB', docName, nodes: get().nodes, edges: get().edges })
        },
      })
      return () => {
        ws.clean()
        // window.removeEventListener('keydown', hh)
        // worker.terminate()
      }
    },
    saveToDB: () => {},
    onNodesChange: (changes) => {
      set({
        nodes: applyNodeChanges(changes, get().nodes),
      })
      get().saveToDB()

      setTimeout(() => {
        fireSyncNodes(changes, get().nodes)
      })
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

      setTimeout(() => {
        fireSyncEdges(changes, get().edges)
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
        const targetIsGrouper = event.target.classList.contains('export-group')

        if (targetIsPane || targetIsGrouper) {
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
        // get().fitToView()
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

      if (get().addNodeOnly) {
        let nodes = get().nodes
        nodes.push(newNode)
        let edges = get().edges
        set({ edges: [...edges], nodes: [...nodes], addNodeOnly: false })
      } else if (get()?.hand?.handleType === 'source') {
        let newEdge = {
          id: getID(),
          source: get().hand?.nodeId,
          sourceHandle: get().hand.handleId,
          targetHandle: get().remoteHandleName,
          target: id,
          type: 'CloseEdge',
        }
        let edges = get().edges
        edges.push(newEdge)
        let nodes = get().nodes
        nodes.push(newNode)
        set({ edges: [...edges], nodes: [...nodes], addNodeOnly: false })
      } else if (get()?.hand?.handleType === 'target') {
        let newEdge = {
          id: getID(),
          source: id,
          sourceHandle: get().remoteHandleName,
          targetHandle: get().hand.handleId,
          target: get().hand?.nodeId,
          type: 'CloseEdge',
        }

        let edges = get().edges
        edges.push(newEdge)
        let nodes = get().nodes
        nodes.push(newNode)
        set({ edges: [...edges], nodes: [...nodes], addNodeOnly: false })
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

    // resetDemo: () => {
    //   set(reset)
    //   get().saveToDB()
    // },
  }
})
