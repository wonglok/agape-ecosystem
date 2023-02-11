import { create } from 'zustand'
import { WebsocketProvider } from './WebSocketProvider'
import * as Y from 'yjs'
import { getID } from '@/backend/aws'
export const useRealtime = create((set, get) => {
  return {
    //
    socket: false,
    doc: false,
    contentYA: false,
    openDoc: () => {
      let doc = new Y.Doc()
      let documentName = 'defaultDoc'
      let roomName = 'roomNameDefault'

      const contentYA = doc.getArray('content')

      let socket = new WebsocketProvider(`ws://localhost:3333`, `${roomName}`, doc, {
        params: { documentName: documentName },
      })

      // setInterval(() => {
      //   contentYA.push([{ yo: 1123 }])
      // }, 5000)

      // contentYA.observe((event) => {
      //   console.log(event, 'yarray was modified')
      // })

      set({ socket, doc, contentYA })

      return () => {
        socket.disconnect()
        set({ socket: false })
      }
    },
  }
})
