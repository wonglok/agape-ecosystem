import { create } from 'zustand'

export const useFlow = create((set, get) => {
  return {
    //
    ready: null,
    nodes: [],
    edges: [],
    openFile: ({ docName }) => {
      set({ ready: null })

      console.log(docName)
      set({ ready: true })

      return () => {
        set({ ready: null })
        //
      }
    },
  }
})
