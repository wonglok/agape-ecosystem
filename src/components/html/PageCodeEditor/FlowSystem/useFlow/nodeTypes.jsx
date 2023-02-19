import path from 'path'
const nodeTypes = {}
const nodeTemplateList = []
const nodeHandlesByNodeTypes = []
function importAll(r) {
  r.keys().forEach((key) => {
    let moduleObject = r(key)
    let nodeName = path.basename(key).replace('.jsx', '')

    nodeTypes[nodeName] = moduleObject.default

    if (!nodeTemplateList.some((r) => r.type === nodeName) && moduleObject) {
      nodeTemplateList.push({
        type: nodeName,
        module: moduleObject,
      })
    }

    if (moduleObject?.handles) {
      nodeHandlesByNodeTypes.push({ type: nodeName, handles: moduleObject.handles || [] })
    }
  })
}

importAll(require.context('./Nodes', true, /\.(jsx)$/, 'sync'))

//
export { nodeTypes, nodeTemplateList, nodeHandlesByNodeTypes }
