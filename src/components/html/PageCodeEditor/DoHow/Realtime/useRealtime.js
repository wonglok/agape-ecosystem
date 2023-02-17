import { create } from 'zustand'
import * as Y from 'yjs'
import { AWSBackend } from 'aws.config'
import { addEdge, applyNodeChanges, applyEdgeChanges } from 'reactflow'
// import { Object3D } from 'three'
// import { proxy } from 'valtio'
// import { bind } from 'valtio-yjs'
// import { v4 } from 'uuid'
// import { Observable } from 'lib0/observable'
// import { fromUint8Array, toUint8Array } from 'js-base64'
import { toBase64, fromBase64 } from 'lib0/buffer'

export class Send {
  constructor({ doc, url, docName }) {
    this.url = url
    this.docName = docName
    this.doc = doc
    // this.set = set
    // this.get = get
    this.open({ doc, url, docName })
  }
  ensureSend(object) {
    let tt = setInterval(() => {
      if (this?.socket?.readyState === this?.socket?.OPEN && this.socket) {
        clearInterval(tt)
        this?.socket?.send(JSON.stringify(object))
      }
    })
  }
  async open({}) {
    if (this.socket) {
      this.socket.onerror = () => {}
      this.socket.onopen = () => {}
      this.socket.onclose = () => {}
      this.socket.onmessage = () => {}
      this.socket.close()
    }
    this.socket = new WebSocket(this.url)
    this.socket.onmessage = (ev) => {
      let bodyData = JSON.parse(ev.data)
      let action = bodyData.action

      if (action === 'init') {
        this.socket.connectionId = bodyData.connectionId
        Y.applyUpdate(this.doc, fromBase64(bodyData.update), 'init')
      }

      if (action === 'operation') {
        Y.applyUpdate(this.doc, fromBase64(bodyData.update), 'operation')
      }

      // if (action === 'init') {
      //   this.socket.connectionId = bodyData.connectionId
      //   Y.applyUpdate(this.doc, fromBase64(bodyData.update), 'init')
      // }

      // if (operation === 'init') {
      //   this.socket.connectionId = bodyData.connectionId
      //   console.log('init apply update')
      //   Y.applyUpdate(this.doc, fromBase64(bodyData.update), 'init')
      // }
    }

    this.socket.onerror = () => {
      setTimeout(() => {
        this.open({})
      }, 1000 * 30)
    }

    this.socket.onclose = () => {
      setTimeout(() => {
        this.open({})
      }, 1000 * 30)
    }

    this.doc.on('update', (update, origin) => {
      if (origin === null) {
        this.ensureSend({ action: 'operation', docName: this.docName, update: toBase64(update) })
      }
    })

    this.ensureSend({ action: 'init', docName: this.docName })
  }
  close() {
    this.socket.onerror = () => {}
    this.socket.onopen = () => {}
    this.socket.onclose = () => {}
    this.socket.onmessage = () => {}
    this.socket.close()
    this.socket = false
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
    onOpen: ({ roomName, docName }) => {
      let doc = new Y.Doc()

      set({
        //
        doc: doc,
      })

      let url = `${AWSBackend[process.env.NODE_ENV].ws}?docName=${encodeURIComponent(docName)}`

      let sender = new Send({ doc, url: url, docName })

      doc.on('update', () => {
        //
        set({
          nodes: get().mapToArray('nodes'),
          edges: get().mapToArray('edges'),
        })
        //
      })
      // let provider = new WebsocketProvider(`${backendInfo.ws}`, `${documentName}`, doc, {
      //   params: {
      //     documentName: documentName,
      //   },
      // })

      return () => {
        sender.close()
        // provider.destroy()
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

    updateMapToServer: (yMapData, newArray) => {
      get().doc.transact(() => {
        yMapData.clear()
        newArray.forEach((it) => {
          yMapData.set(it.id, it)
        })
        // newArray.forEach((it) => {
        //   if (yMapData.has(it.id)) {
        //     let item = yMapData.get(it.id)
        //     if (JSON.stringify(item) !== JSON.stringify(it)) {
        //       yMapData.set(it.id, it)
        //     }
        //   } else {
        //     yMapData.set(it.id, it)
        //   }
        // })

        // yMapData.forEach((it) => {
        //   if (!newArray.some((la) => la.id === it.id)) {
        //     yMapData.delete(it.id)
        //   }
        // })
      })
    },
    onNodesChange: (changes) => {
      let newNodes = applyNodeChanges(changes, get().nodes)

      let newArray = newNodes
      let yMapData = get().doc.getMap('nodes')
      get().updateMapToServer(yMapData, newArray)

      // set({ nodes: newNodes })
      // let oldNodes = get().mapToArray('nodes')
      // const results = newNodes.filter(({ id: id1 }) => !oldNodes.some(({ id: id2 }) => id2 === id1))

      // set({ nodes: latest })
      // get().applyMapToServer('nodes', latest)
    },

    onEdgesChange: (changes) => {
      let latest = applyEdgeChanges(changes, get().edges)

      let newArray = latest
      let yMapData = get().doc.getMap('edges')

      // set({ edges: latest })

      get().updateMapToServer(yMapData, newArray)

      // get().applyMapToServer('edges', latest)
    },

    onConnect: (connection) => {
      let latest = addEdge(connection, get().edges)

      let newArray = latest
      let yMapData = get().doc.getMap('edges')
      get().updateMapToServer(yMapData, newArray)

      // set({ edges: latest })

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

      let newArray = [...latest]
      let yMapData = get().doc.getMap('nodes')
      get().updateMapToServer(yMapData, newArray)

      // set({ nodes: latest })
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

      let newArray = [...latest]
      let yMapData = get().doc.getMap('nodes')
      get().updateMapToServer(yMapData, newArray)

      // set({ nodes: latest })
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
