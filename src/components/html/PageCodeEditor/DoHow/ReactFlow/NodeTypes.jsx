import path from 'path'

export const NodeTypes = {}
export const NodeOptions = []

function importAll(r) {
  r.keys().forEach((key) => {
    let moduleObject = r(key)
    let nodeName = path.basename(key).replace('.jsx', '')

    NodeTypes[nodeName] = moduleObject.default

    // if (!NodeOptions.some((r) => r.label === nodeName) && moduleObject.createItem) {
    //   NodeOptions.push({
    //     label: nodeName,
    //     value: moduleObject.createItem(),
    //   })
    // }
  })
}

importAll(require.context('./Nodes', true, /\.(jsx)$/, 'sync'))

//
