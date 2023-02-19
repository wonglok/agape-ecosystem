import * as Y from 'yjs'
import { IndexeddbPersistence } from 'y-indexeddb'

function toArray(map) {
  let arr = []
  for (let item of map.values()) {
    arr.push(item)
  }
  return arr
}

let doc = new Y.Doc()

const rootManager = new Y.UndoManager([doc.getMap('nodes'), doc.getMap('edges')])

let sync = () => {
  self.postMessage({
    type: 'sync',
    nodes: toArray(doc.getMap('nodes')),
    edges: toArray(doc.getMap('edges')),
  })
}

rootManager.on('stack-item-popped', sync)
rootManager.off('stack-item-popped', sync)

let provider = false
self.onmessage = (ev) => {
  if (ev.data.type === 'load') {
    provider = new IndexeddbPersistence(ev.data.docName, doc)
    provider.whenSynced.then(() => {
      sync()
    })
  } else if (ev.data.type === 'saveDB') {
    let edges = ev.data.edges
    let nodes = ev.data.nodes
    doc.transact(() => {
      let nodesMap = doc.getMap('nodes')
      let edgesMap = doc.getMap('edges')
      nodesMap.clear()
      edgesMap.clear()

      nodes.forEach((it) => {
        nodesMap.set(it.id, it)
      })
      edges.forEach((it) => {
        edgesMap.set(it.id, it)
      })
    })
  } else if (ev.data.type === 'undo') {
    rootManager.undo()
  } else if (ev.data.type === 'undo') {
    rootManager.redo()
  }
  //
}
