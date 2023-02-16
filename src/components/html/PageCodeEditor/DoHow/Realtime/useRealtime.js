import { create } from 'zustand'
// import { WebsocketProvider } from './WebSocketProvider'
import { AWSData, getID } from '@/backend/aws'
import * as Y from 'yjs'
import { AWSBackend } from 'aws.config'
import { addEdge, applyNodeChanges, applyEdgeChanges } from 'reactflow'
import { Object3D } from 'three'
import { proxy } from 'valtio'
import { bind } from 'valtio-yjs'
import { v4 } from 'uuid'
import { Observable } from 'lib0/observable'
import { fromUint8Array, toUint8Array } from 'js-base64'

class ArcProvider extends Observable {
  /**
   * @param {Y.Doc} ydoc
   */
  constructor(ydoc, ws, documentName) {
    super()
    this.id = getID()

    this.socket = new WebSocket(`${ws}?docName=${encodeURIComponent(documentName)}`)

    this.socket.onmessage = (ev) => {
      let info = JSON.parse(ev.data)

      if ((info.update64 && info.actionType === 'initDown') || info.actionType === 'sync') {
        let updateBin = toUint8Array(info.update64)
        Y.applyUpdate(ydoc, updateBin, info.origin || null)
      }
    }

    this.socket.onerror = (ev) => {
      console.error(ev)
    }

    this.socket.ensureSend = (object) => {
      let tt = setInterval(() => {
        if (this.socket.readyState === this.socket.OPEN) {
          clearInterval(tt)
          this.socket.send(JSON.stringify(object))
        }
      })
    }

    ydoc.on('update', (update, origin) => {
      // console.log(update, origin)

      if (origin !== this.id) {
        // this update was produced either locally or by another provider.
        this.emit('update', [update])
      }

      // this.socket.ensureSend(update)

      // if (origin === this.id) {
      //   // this.ws.ensureSend(update)
      // } else if (origin !== this.id) {
      //   this.ws.ensureSend(update)
      //
      //   //
      // }
    })
    // listen to an event that fires when a remote update is received
    this.on('update', (update) => {
      this.socket.ensureSend({
        actionType: 'sync',
        docName: documentName,
        update64: fromUint8Array(update),
        origin: this.id,
      })

      Y.applyUpdate(ydoc, update, this.id) // the third parameter sets the transaction-origin
    })

    this.socket.ensureSend({
      actionType: 'init',
      docName: documentName,
      origin: this.id,
    })
  }
  disconnect() {
    this.off('update')
  }
}

export const createNewDocument = () => new Y.Doc()

// export const createRealTime = ({ token = '', roomName = '', documentName }) => {
//   let backendInfo = AWSBackend[process.env.NODE_ENV]
//   let ydoc = new Y.Doc()
//   let socket = new WebsocketProvider(`${backendInfo.ws}`, `${roomName}`, ydoc, {
//     params: {
//       roomName: roomName,
//       token: token,
//       documentName: documentName,
//     },
//   })

//   return {
//     roomName,
//     documentName,
//     socket,
//     doc: ydoc,
//   }
// }

export const useRealtime = create((set, get) => {
  return {
    doc: false,
    nodes: [],
    edges: [],
    nodesAPI: [],
    edgesAPI: [],
    onOpen: ({ roomName, documentName }) => {
      let backendInfo = AWSBackend[process.env.NODE_ENV]
      let doc = new Y.Doc()

      let provider = new ArcProvider(doc, `${backendInfo.ws}`, `${documentName}`)
      // let socket = new WebsocketProvider(`${backendInfo.ws}`, `${roomName}`, doc, {
      //   params: {
      //     roomName: roomName,
      //     token: AWSData.jwt || `_${v4()}`,
      //     documentName: documentName,
      //   },
      // })

      doc.on('update', () => {
        //
        set({
          nodes: get().mapToArray('nodes'),
          edges: get().mapToArray('edges'),
        })
      })

      set({
        //
        doc: doc,
      })
      return () => {
        provider.destroy()
        // socket.disconnect()
        // socket.disconnectBc()
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

    pulseToServer: (yMapData, newArray) => {
      newArray.forEach((it) => {
        if (yMapData.has(it.id)) {
          let item = yMapData.get(it.id)

          if (JSON.stringify(item) !== JSON.stringify(it)) {
            yMapData.set(it.id, it)
          }
        } else {
          yMapData.set(it.id, it)
        }
      })

      yMapData.forEach((it) => {
        if (!newArray.some((la) => la.id === it.id)) {
          yMapData.delete(it.id)
        }
      })
    },
    onNodesChange: (changes) => {
      let newNodes = applyNodeChanges(changes, get().nodes)

      let newArray = newNodes
      let yMapData = get().doc.getMap('nodes')
      get().pulseToServer(yMapData, newArray)

      // let oldNodes = get().mapToArray('nodes')
      // const results = newNodes.filter(({ id: id1 }) => !oldNodes.some(({ id: id2 }) => id2 === id1))

      // set({ nodes: latest })
      // get().applyMapToServer('nodes', latest)
    },

    onEdgesChange: (changes) => {
      let latest = applyEdgeChanges(changes, get().edges)

      let newArray = latest
      let yMapData = get().doc.getMap('edges')
      get().pulseToServer(yMapData, newArray)

      // get().applyMapToServer('edges', latest)
    },

    onConnect: (connection) => {
      let latest = addEdge(connection, get().edges)

      let newArray = latest
      let yMapData = get().doc.getMap('edges')
      get().pulseToServer(yMapData, newArray)

      // get().applyMapToServer('edges', latest)
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

      let newArray = newNodes
      let yMapData = get().doc.getMap('nodes')
      get().pulseToServer(yMapData, newArray)
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

      let newArray = newNodes
      let yMapData = get().doc.getMap('nodes')
      get().pulseToServer(yMapData, newArray)
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
      // let oldDoc = get().doc
      // let newDoc = new Y.Doc()
      // oldDoc.getMap('nodes').forEach((it) => {
      //   newDoc.getMap('nodes').set(it.id, it)
      // })
      // oldDoc.getMap('edges').forEach((it) => {
      //   newDoc.getMap('edges').set(it.id, it)
      // })
      // array.forEach((it) => {
      //   newDoc.getMap(name).set(it.id, it)
      // })
      // const stateVector1 = Y.encodeStateVector(newDoc)
      // const stateVector2 = Y.encodeStateVector(oldDoc)
      // const diff1 = Y.encodeStateAsUpdate(newDoc, stateVector2)
      // const diff2 = Y.encodeStateAsUpdate(oldDoc, stateVector1)
      // Y.applyUpdate(newDoc, diff2)
      // Y.applyUpdate(oldDoc, diff1)
      //
      //
      // array.forEach(it=>{
      // })
      // newDoc.getMap(name)
      // console.log(newDoc)
      // let yesMap = get().doc.getMap(name)
      // array.forEach((it) => {
      //   if (!yesMap.has(it.id)) {
      //     yesMap.set(it.id, { ...it })
      //   } else {
      //     let jsonFromCloud = JSON.stringify(yesMap.get(it.id))
      //     let jsonLatest = JSON.stringify(it)
      //     if (jsonFromCloud !== jsonLatest) {
      //       yesMap.set(it.id, { ...it })
      //     } else {
      //       console.log('same no neeed update')
      //     }
      //   }
      // })
      // // yesMap.forEach((it) => {
      // //   if (!array.some((r) => r.id === it)) {
      // //     yesMap.delete(it.id)
      // //   }
      // // })
      // array.forEach((it) => {
      //   if (!yesMap.has(it.id)) {
      //     yesMap.delete(it.id)
      //   }
      // })
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
