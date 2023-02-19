export const nodeTypes = {}
export const nodeTypeList = []
function importAll(r) {
  r.keys().forEach((key) => {
    let moduleObject = r(key)
    let nodeName = moduleObject.name

    nodeTypes[nodeName] = moduleObject.default

    if (!nodeTypeList.some((r) => r.name === moduleObject.name)) {
      nodeTypeList.push({
        ...moduleObject,
        type: moduleObject.name,
        gui: moduleObject.default,
      })
    }
  })
}

export let checkSupportDataTypes = (template, arr = []) => {
  return arr.some((dataType) => {
    return (template?.handles || []).some((h) => h.dataType === dataType)
  })
}

export let getTemplateByNodeInstance = (node) => {
  return nodeTypeList.find((t) => t.type === node?.type)
}
export let getDataTypesFromTemplate = (template) => {
  return (template?.handles || []).map((r) => r.dataType)
}

export let getCreateItems = ({ handTemplate, nodes, hand }) => {
  //
  let dataTypes = getDataTypesFromTemplate(handTemplate)

  let templates = nodeTypeList.filter((template) => {
    return checkSupportDataTypes(template, dataTypes)
  })

  return templates
    .filter((tp) => {
      // console.log()
      return true
    })
    .map((it) => {
      return {
        label: it.name,
        value: it.name,
        children: it.handles
          .filter((h) => {
            if (hand.handleType === 'target') {
              return h.type === 'source'
            } else {
              return h.type === 'target'
            }
          })
          .filter((t) => {
            return hand.handleId === t.id
          })
          .map((t) => {
            return {
              label: `${t.displayName} ${t.type}`,
              value: t.id,
            }
          }),
      }
    })
}

export const getOptions = ({ nodes, hand }) => {
  //!SECTION

  let handTemplate = getTemplateByNodeInstance(hand.node)

  return [
    {
      value: 'create',
      label: 'Create',
      children: getCreateItems({ handTemplate, nodes, hand }),
    },
    {
      value: 'connect',
      label: 'Connect',
      children: [
        //
      ],
    },
  ]
}

importAll(require.context('./Nodes', true, /\.(jsx)$/, 'sync'))

//
