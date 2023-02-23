// import * as Y from 'yjs'
// import { IndexeddbPersistence } from 'y-indexeddb'
import localforage from 'localforage'

let store = localforage.createInstance({
  name: 'documents',
})

// function toArray(map) {
//   let arr = []
//   for (let item of map.values()) {
//     arr.push(item)
//   }
//   return arr
// }

// let doc = new Y.Doc()

// let sync = () => {
//   self.postMessage({
//     type: 'sync',
//     nodes: toArray(doc.getMap('nodes')),
//     edges: toArray(doc.getMap('edges')),
//   })
// }

// doc.on('update', () => {
//   sync()
// })
// const rootManager = new Y.UndoManager([doc.getMap('nodes'), doc.getMap('edges')])
// rootManager.on('stack-item-popped', sync)
// rootManager.off('stack-item-popped', sync)
// rootManager.on('stack-item-updated', sync)
// let provider = false

self.onclose = () => {
  // provider?.destroy()
}

// doc.transact(() => {
//   let nodesMap = doc.getMap('nodes')
//   let edgesMap = doc.getMap('edges')

//   nodesMap.clear()
//   edgesMap.clear()

//   nodes.forEach((it) => {
//     let store = JSON.stringify(nodesMap.get(it.id))
//     let now = JSON.stringify(it)
//     if (store !== now) {
//       nodesMap.set(it.id, it)
//     }
//   })
//   edges.forEach((it) => {
//     let store = JSON.stringify(edgesMap.get(it.id))
//     let now = JSON.stringify(it)
//     if (store !== now) {
//       edgesMap.set(it.id, it)
//     }
//   })
// })

self.onmessage = (ev) => {
  if (ev.data.type === 'load') {
    // provider = new IndexeddbPersistence(ev.data.docName, doc)
    // provider.whenSynced.then(() => {
    //   sync()
    // })
    store.getItem(ev.data.docName).then((doc) => {
      if (typeof doc === 'string') {
        let data = JSON.parse(doc)
        self.postMessage({
          type: 'sync',
          nodes: data.nodes,
          edges: data.edges,
        })
      }
    })
  } else if (ev.data.type === 'saveDB') {
    let edges = ev.data.edges
    let nodes = ev.data.nodes

    store.setItem(ev.data.docName, JSON.stringify({ nodes: nodes, edges: edges }))
  } else if (ev.data.type === 'undo') {
    // rootManager.undo()
  } else if (ev.data.type === 'redo') {
    // rootManager.redo()
  }
  //
}
