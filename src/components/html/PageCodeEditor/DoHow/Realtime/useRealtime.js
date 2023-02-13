import { create } from 'zustand'
import { WebsocketProvider } from './WebSocketProvider'
import { AWSData, getID } from '@/backend/aws'
import * as Y from 'yjs'
import { AWSBackend } from 'aws.config'
import { useFlowStore } from '../ReactFlow/useFlowStore'

export const createNewDocument = () => new Y.Doc()

export const crerateSocket = ({ token = '', roomName = '', doc, documentName }) => {
  let backendInfo = AWSBackend[process.env.NODE_ENV]
  let socket = new WebsocketProvider(`${backendInfo.ws}`, `${roomName}`, doc, {
    params: {
      roomName: roomName,
      token: token,
      documentName: documentName,
    },
  })

  return socket
}

export const useRealtime = create((set, get) => {
  return {
    showTool: false,
    toolTop: '0px',
    toolLeft: '0px',
    newNodePos: { x: 0, y: 0 },
    connectingNodeId: '',
    onAddNode: (payload) => {
      //
      const id = getID()

      const newNode = payload
      newNode.id = id
      newNode.position = get().newNodePos

      let api = get().currentAPI
      let nodesRaw = api.doc.getArray('nodes')
      nodesRaw.push([newNode])

      let edgesRaw = api.doc.getArray('edges')
      let newEdge = { id: getID(), source: get().connectingNodeId, target: id }
      edgesRaw.push([newEdge])

      // get().currentAPI.doc.getMap('nodes').set(newNode.id, newNode)
      // get().currentAPI.doc.getMap('edges').set(newEdge.id, newEdge)

      set({ showTool: false })
    },

    onConnectNode: (payload) => {
      let newEdgeID = getID()
      let newEdge = { id: newEdgeID, source: get().connectingNodeId, target: payload.id }

      get().currentAPI.doc.getArray('edges').push([newEdge])

      set({ showTool: false })
    },

    currentAPI: false,
    makeCurrent: ({ roomName, documentName }) => {
      let api = get().provideAPI({ token: AWSData.jwt || '__', roomName: roomName, documentName: documentName })
      set({ currentAPI: api })

      let cleans = []
      try {
        let syncAttr = (attrName = 'nodes') => {
          let yesArray = api.doc.getArray(attrName)

          let hh = () => {
            useFlowStore.setState({ [attrName]: yesArray.toArray() })
          }
          yesArray.observe(hh)
          cleans.push(() => {
            yesArray.unobserve(hh)
          })
        }

        syncAttr('nodes')
        syncAttr('edges')

        let autoUpload = (attrName) => {
          let tt = setInterval(() => {
            //prevent over compute
            if (useFlowStore.getState().uploadSignal !== 0) {
              useFlowStore.getState().uploadSignal = 0
              let array = useFlowStore.getState()[attrName]
              let yesArray = api.doc.getArray(attrName)

              // array.forEach((it) => {
              //   let jsonFromCloud = JSON.stringify(yesArray.get(it.id))
              //   let jsonLatest = JSON.stringify(it)
              //   if (jsonFromCloud !== jsonLatest) {
              //     yesArray.set(it.id, it)
              //   }
              // })

              yesArray.delete(0, yesArray.length)
              yesArray.push(array)
            }
          }, 250)

          cleans.push(() => {
            clearInterval(tt)
          })
        }

        autoUpload('nodes')
        autoUpload('edges')
      } catch (e) {
        console.error(e)
      }

      return () => {
        api.clean()
        cleans.forEach((r) => r())
      }
    },
    provide: ({ key = 'keystring', onCreate = () => {} }) => {
      let self = get()

      if (self[key]) {
        return self[key]
      } else {
        let defaultValue = onCreate()
        set({ [key]: defaultValue })
        return defaultValue
      }
    },
    provideAPI: ({ token = AWSData.jwt, roomName, documentName }) => {
      let self = get()
      let docKey = `_${roomName}_${documentName}_doc`
      let socketKey = `_${roomName}_${documentName}_socket`

      let doc = self.provide({
        key: docKey,
        onCreate: () => {
          return createNewDocument()
        },
      })

      let socket = self.provide({
        key: socketKey,
        onCreate: () => {
          return crerateSocket({ token: token, roomName, documentName, doc })
        },
      })

      return {
        doc,
        socket,
        clean: () => {
          socket.disconnect()
          doc.destroy()

          set({
            [docKey]: false,
            [socketKey]: false,
          })
        },
      }
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
