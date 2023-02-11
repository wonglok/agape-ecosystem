export const NodeTypes = {}

function importAll(r) {
  r.keys().forEach((key) => {
    NodeTypes[key] = r(key)
    console.log(r(key))
  })
}

importAll(require.context('./Nodes', true, /\.(jsx)$/, 'sync'))

//
