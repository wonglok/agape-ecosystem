import { create } from 'zustand'
import { WebsocketProvider } from './WebSocketProvider'
import { AWSData, getID } from '@/backend/aws'
import * as Y from 'yjs'
import { AWSBackend } from 'aws.config'
import { useFlowStore } from '../ReactFlow/useFlowStore'

export const createNewDocument = () => new Y.Doc()

export const crerateSocket = ({ token = '', roomName = '', documentName }) => {
  let backendInfo = AWSBackend[process.env.NODE_ENV]
  let doc = createNewDocument()
  let socket = new WebsocketProvider(`${backendInfo.ws}`, `${roomName}`, doc, {
    params: {
      roomName: roomName,
      token: token,
      documentName: documentName,
    },
  })

  return {
    socket,
    doc,
  }
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
      let nodesRaw = api.doc.getMap('nodes')
      nodesRaw.set(newNode.id, newNode)

      let edgesRaw = api.doc.getMap('edges')
      let newEdge = { id: getID(), source: get().connectingNodeId, target: id }
      edgesRaw.set(newEdge.id, newEdge)

      // get().currentAPI.doc.getMap('nodes').set(newNode.id, newNode)
      // get().currentAPI.doc.getMap('edges').set(newEdge.id, newEdge)

      set({ showTool: false })
    },

    onConnectNode: (payload) => {
      let newEdgeID = getID()
      let newEdge = { id: newEdgeID, source: get().connectingNodeId, target: payload.id }

      get().currentAPI.doc.getMap('edges').set(newEdge.id, newEdge)

      set({ showTool: false })
    },

    currentAPI: false,
    makeCurrent: ({ roomName, documentName }) => {
      let api = get().provideAPI({ token: AWSData.jwt || '__', roomName: roomName, documentName: documentName })
      set({ currentAPI: api })

      let cleans = []
      try {
        let syncAttr = (attrName = 'nodes') => {
          let yesMap = api.doc.getMap(attrName)

          let hh = () => {
            let myArr = []
            yesMap.forEach((it) => {
              myArr.push(it)
            })

            useFlowStore.setState({ [attrName]: myArr })
          }

          yesMap.observe(hh)
          cleans.push(() => {
            yesMap.unobserve(hh)
          })
        }

        syncAttr('nodes')
        syncAttr('edges')
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
    applyFlow: (name = 'nodes', array = []) => {
      let yesMap = get().currentAPI.doc.getMap(name)

      array.forEach((it) => {
        let jsonFromCloud = JSON.stringify(yesMap.get(it.id))
        let jsonLatest = JSON.stringify(it)

        if (jsonFromCloud !== jsonLatest) {
          yesMap.set(it.id, { ...it })
        }
      })

      array.forEach((it) => {
        if (!yesMap.has(it.id)) {
          yesMap.delete(it.id)
        }
      })
    },
    provideAPI: ({ token = AWSData.jwt, roomName, documentName }) => {
      let self = get()
      let caceKey = `${roomName}${documentName}`

      let { doc, socket } = self.provide({
        key: caceKey,
        onCreate: () => {
          return crerateSocket({ token: token, roomName, documentName })
        },
      })

      return {
        doc,
        socket,
        clean: () => {
          socket.disconnect()
          doc.destroy()

          set({
            [caceKey]: false,
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
