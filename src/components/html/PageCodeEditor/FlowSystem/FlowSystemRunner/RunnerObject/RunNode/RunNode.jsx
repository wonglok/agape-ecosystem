import { useEffect, useMemo } from 'react'
import { nodeTypeList } from '../../../useFlow/nodeTypes'
import { useCore } from '../useCore/useCore'

export function RunNode({ globals, node, edges }) {
  let nodeTemplate = useMemo(() => {
    return nodeTypeList.find((r) => r.type === node.type)
  }, [node.type])

  let core = useCore()

  let { on } = useMemo(() => {
    let map = new Map()
    edges
      .filter((r) => r.target === node.id)
      .forEach((edge) => {
        let bc = new BroadcastChannel(`${edge.target}${edge.targetHandle}`)
        map.set(edge.targetHandle, bc)
        core.onClean(() => {
          bc.close()
        })
      })

    let on = (name, fnc) => {
      let bc = map.get(`${node.id}${name}`)
      let hh = (ev) => {
        fnc(ev.data)
      }
      bc.addEventListener('message', hh)
      core.onClean(() => {
        bc.removeEventListener('message', hh)
      })
    }

    edges
      .filter((r) => r.source === node.id)
      .forEach((edge) => {
        let bc = new BroadcastChannel(`${edge.source}${edge.sourceHandle}`)
        map.set(edge.sourceHandle, bc)
        core.onClean(() => {
          bc.close()
        })
      })

    let send = (name, data) => {
      let bc = map.get(`${node.id}${name}`)
      bc.postMessage(data)
    }
    return {
      send,
      on,
    }
  }, [core, node, edges])

  useEffect(() => {
    let run = nodeTemplate.run
    if (run) {
      run({ core, globals, on })
    }
  }, [core, nodeTemplate, globals, on])

  return (
    <>
      {/*  */}
      {/*  */}
      {/*  */}
    </>
  )
}
