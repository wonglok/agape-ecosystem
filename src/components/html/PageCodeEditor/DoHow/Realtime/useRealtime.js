import { create } from 'zustand'
import { WebsocketProvider } from './WebSocketProvider'
import { AWSData, getID } from '@/backend/aws'
import * as Y from 'yjs'
import { AWSBackend } from 'aws.config'
import { addEdge, applyNodeChanges, applyEdgeChanges } from 'reactflow'
import { Object3D } from 'three'
import { proxy } from 'valtio'
import { bind } from 'valtio-yjs'
import { v4 } from 'uuid'

export const createNewDocument = () => new Y.Doc()

export const createRealTime = ({ token = '', roomName = '', documentName }) => {
  let backendInfo = AWSBackend[process.env.NODE_ENV]
  let ydoc = new Y.Doc()
  let socket = new WebsocketProvider(`${backendInfo.ws}`, `${roomName}`, ydoc, {
    params: {
      roomName: roomName,
      token: token,
      documentName: documentName,
    },
  })

  return {
    roomName,
    documentName,
    socket,
    doc: ydoc,
  }
}

export const useRealtime = create((set, get) => {
  return {
    doc: false,
    socket: false,
    nodes: [],
    edges: [],
    nodesAPI: [],
    edgesAPI: [],
    onOpen: ({ roomName, documentName }) => {
      let backendInfo = AWSBackend[process.env.NODE_ENV]
      let doc = new Y.Doc()
      let socket = new WebsocketProvider(`${backendInfo.ws}`, `${roomName}`, doc, {
        params: {
          roomName: roomName,
          token: AWSData.jwt || `_${v4()}`,
          documentName: documentName,
        },
      })

      let nodesAPI = doc.getMap('nodes')
      let edgesAPI = doc.getMap('edges')
      let nodesHH = () => {
        let nodes = []
        for (let item of nodesAPI.values()) {
          nodes.push(item)
        }
        set({ nodes })
      }
      let edgesHH = () => {
        let edges = []
        for (let item of edgesAPI.values()) {
          edges.push(item)
        }
        set({ edges })
      }
      nodesAPI.observeDeep(nodesHH)
      edgesAPI.observeDeep(edgesHH)
      set({
        //
        doc: doc,
        socket,
        nodesAPI,
        edgesAPI,
      })
      return () => {
        nodesAPI.unobserveDeep(nodesHH)
        edgesAPI.unobserveDeep(edgesHH)

        socket.disconnect()
        socket.disconnectBc()
      }
    },

    onNodesChange: (changes) => {
      let latest = applyNodeChanges(changes, get().nodes)

      set({ nodes: latest })
      get().applyMapToServer('nodes', latest)
    },

    onEdgesChange: (changes) => {
      let latest = applyEdgeChanges(changes, get().edges)

      set({ edges: latest })
      get().applyMapToServer('edges', latest)
    },

    onConnect: (connection) => {
      let latest = addEdge(connection, get().edges)
      set({ edges: latest })
      get().applyMapToServer('edges', latest)
    },

    updateNodeLabel: (nodeId, label) => {
      let latest = get().nodes.map((node) => {
        if (node.id === nodeId) {
          //
          // it's important to create a new object here, to inform React Flow about the cahnges
          node.data = { ...node.data, label }
        }
        return node
      })

      set({ nodes: latest })
      get().applyMapToServer('nodes', latest)
    },
    updateNodeColor: (nodeId, color) => {
      let latest = get().nodes.map((node) => {
        if (node.id === nodeId) {
          //
          // it's important to create a new object here, to inform React Flow about the cahnges
          node.data = { ...node.data, color }
        }
        return node
      })

      set({ nodes: latest })
      get().applyMapToServer('nodes', latest)
    }, ///!SECTION

    // doc: false,
    // socket: false,
    // nodes: [],
    // edges: [],
    // isSelf: 0,
    // onNodesChange: (changes) => {
    //   let latest = applyNodeChanges(changes, get().nodes)
    //   set({
    //     nodes: [...latest],
    //   })
    // },
    // onEdgesChange: (changes) => {
    //   let edges = applyEdgeChanges(changes, get().edges)
    //   set({
    //     edges: [...edges],
    //   })
    // },
    // onConnect: (connection) => {
    //   let edges = addEdge(connection, get().edges)
    //   set({
    //     edges: [...edges],
    //   })
    // },
    // //

    // ///
    showTool: false,
    toolTop: '0px',
    toolLeft: '0px',
    newNodePos: { x: 0, y: 0 },
    connectingNodeId: '',
    onAddNode: (payload) => {
      // //
      // const id = getID()
      // const newNode = payload
      // newNode.id = id
      // newNode.position = get().newNodePos
      // let nodesRaw = get().doc.getMap('nodes')
      // nodesRaw.set(newNode.id, newNode)
      // let edgesRaw = get().doc.getMap('edges')
      // let newEdge = { id: getID(), source: get().connectingNodeId, target: id }
      // edgesRaw.set(newEdge.id, newEdge)
      // // get().currentAPI.doc.getMap('nodes').set(newNode.id, newNode)
      // // get().currentAPI.doc.getMap('edges').set(newEdge.id, newEdge)
      // set({ showTool: false })
    },
    onConnectNode: (payload) => {
      // let newEdgeID = getID()
      // let newEdge = { id: newEdgeID, source: get().connectingNodeId, target: payload.id }
      // get().currentAPI.doc.getMap('edges').set(newEdge.id, newEdge)
      // set({ showTool: false })
    },

    // currentAPI: false,
    // makeCurrent: ({ roomName, documentName }) => {
    //   let { doc, socket } = crerateSocket({ token: AWSData.jwt || `___${Math.random()}`, roomName, documentName })
    //   set({ doc, socket })
    //   let cleans = []
    //   try {
    //     let syncAttr = (attrName = 'nodes') => {
    //       let yesMap = get().doc.getMap(attrName)
    //       let hh = () => {
    //         let myArr = []
    //         yesMap.forEach((it) => {
    //           myArr.push(it)
    //         })
    //         useRealtime.setState({ [attrName]: myArr })
    //       }
    //       yesMap.observe(hh)
    //       cleans.push(() => {
    //         yesMap.unobserve(hh)
    //       })
    //     }
    //     syncAttr('nodes')
    //     syncAttr('edges')
    //   } catch (e) {
    //     console.error(e)
    //   }
    //   return () => {
    //     socket.disconnect()
    //     doc.destroy()
    //     cleans.forEach((r) => r())
    //   }
    // },
    // provide: ({ key = 'keystring', onCreate = () => {} }) => {
    //   let self = get()
    //   if (self[key]) {
    //     return self[key]
    //   } else {
    //     let defaultValue = onCreate()
    //     set({ [key]: defaultValue })
    //     return defaultValue
    //   }
    // },
    applyTimer: 0,
    applyMapToServer: (name = 'nodes', array = []) => {
      let yesMap = get().doc.getMap(name)

      array.forEach((it) => {
        if (!yesMap.has(it.id)) {
          yesMap.set(it.id, { ...it })
        } else {
          let jsonFromCloud = JSON.stringify(yesMap.get(it.id))
          let jsonLatest = JSON.stringify(it)
          if (jsonFromCloud !== jsonLatest) {
            yesMap.set(it.id, { ...it })
          } else {
            console.log('exiting')
          }
        }
      })

      array.forEach((it) => {
        if (!yesMap.has(it.id)) {
          yesMap.delete(it.id)
        }
      })
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
