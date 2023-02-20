// import { useFlow } from './useFlow'

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

    // console.log(nodeTypeList)
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

let filterConnectionSockets = (it, hand) => {
  let handTemplate = getTemplateByNodeInstance(hand.node)

  return it.handles
    .filter((h) => {
      if (hand.handleType === 'target') {
        return h.type === 'source'
      } else {
        return h.type === 'target'
      }
    })
    .filter((h) => {
      let handeHand = handTemplate?.handles?.find((r) => r?.id === hand?.handleId)
      // console.log(handeHand)
      // return handTemplate?.handles.some((h) => h.dataType === handeHand.dataType)

      return h.dataType === handeHand.dataType
      // console.log(h.dataType)
      // return checkSupportDataTypes(handTemplate, [h.dataType])
      // return handTemplate.dataType === h.dataType
      // return hand.handleId === h.id
    })
}

export let getCreateItems = ({ handTemplate, nodes, hand }) => {
  //
  let dataTypes = getDataTypesFromTemplate(handTemplate)

  let templates = nodeTypeList.filter((template) => {
    return checkSupportDataTypes(template, dataTypes)
  })

  return templates
    .filter((template) => {
      return filterConnectionSockets(template, hand).length > 0
    })
    .map((it) => {
      return {
        label: it.name,
        value: it.name,
        children: filterConnectionSockets(it, hand).map((t) => {
          return {
            label: `${t.displayName} ${t.type}`,
            value: t.id,
          }
        }),
      }
    })
}

let getConnectItems = ({ handTemplate, nodes, hand }) => {
  let dataTypes = getDataTypesFromTemplate(handTemplate)

  let templates = nodeTypeList.filter((template) => {
    return checkSupportDataTypes(template, dataTypes)
  })

  let arr = []

  let okTypes = templates.filter((it) => {
    return filterConnectionSockets(it, hand).length > 0
  })

  nodes.forEach((nd) => {
    if (okTypes.some((t) => t.name === nd.type)) {
      let handHandleType = hand?.handleType
      // let handHandleID = hand?.handleId

      let template = getTemplateByNodeInstance(nd)

      let labelChildren = template.handles
        .filter((r) => {
          if (handHandleType === 'target') {
            return r.type === 'source'
          } else {
            return r.type === 'target'
          }
        })

        // .filter((hh) => {
        //   return hh.id === handHandleID && handHandleID !== ''
        // })
        .map((hh) => {
          return {
            label: `${hh.displayName} ${hh.type}`,
            value: hh.id,
          }
        })

      arr.push({
        label: `${nd.type} - ${nd?.data?.label || ''}`,
        value: nd.id,

        children: labelChildren,
      })
    }
  })

  return arr
}

export const getOptions = ({ nodes, hand }) => {
  //!SECTION

  let handTemplate = getTemplateByNodeInstance(hand.node)

  return [
    {
      label: 'Create',
      value: 'create',
      children: getCreateItems({ handTemplate, nodes, hand }),
    },
    {
      label: 'Connect',
      value: 'connect',
      children: getConnectItems({ handTemplate, nodes, hand }),
    },
  ]
}

importAll(require.context('./Nodes', true, /\.(jsx)$/, 'sync'))

//
