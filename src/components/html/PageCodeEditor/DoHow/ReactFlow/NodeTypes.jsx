import path from 'path'

export const NodeTypes = {}

function importAll(r) {
  r.keys().forEach((key) => {
    let file = r(key)
    let nodeName = path.basename(key).replace('.jsx', '')

    NodeTypes[nodeName] = file.default
  })
}

importAll(require.context('./Nodes', true, /\.(jsx)$/, 'sync'))

//
