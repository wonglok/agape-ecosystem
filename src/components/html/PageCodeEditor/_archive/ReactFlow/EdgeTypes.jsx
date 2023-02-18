import path from 'path'

export const EdgeTypes = {}

function importAll(r) {
  r.keys().forEach((key) => {
    let file = r(key)
    let nodeName = path.basename(key).replace('.jsx', '')

    EdgeTypes[nodeName] = file.default
  })
}

importAll(require.context('./Edges', true, /\.(jsx)$/, 'sync'))

//
