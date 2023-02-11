import { create } from 'zustand'
import { WebsocketProvider } from './WebSocketProvider'
import { AWSData, getID } from '@/backend/aws'
import * as Y from 'yjs'
import { AWSBackend } from 'aws.config'

export const createNewDocument = () => new Y.Doc()

export const crerateSocket = ({ token = '', roomName, doc, documentName }) => {
  let backendInfo = AWSBackend[process.env.NODE_ENV]
  let socket = new WebsocketProvider(`${backendInfo.ws}`, `${roomName}`, doc, {
    params: {
      token,
      documentName: documentName,
    },
  })

  return socket
}

export const useRealtime = create((set, get) => {
  return {
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
    provideFile: ({ token = AWSData.jwt, roomName, documentName }) => {
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
          set({
            [docKey]: false,
            [socketKey]: false,
          })
          socket.disconnect()
        },
      }
    },
  }
})
