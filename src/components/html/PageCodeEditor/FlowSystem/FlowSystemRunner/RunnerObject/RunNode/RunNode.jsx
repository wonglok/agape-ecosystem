import { useEffect, useMemo } from 'react'
import { nodeTypeList } from '../../../useFlow/nodeTypes'
import { useCore } from '../useCore/useCore'
import { useFlow } from '../../../useFlow/useFlow'

export function RunNode({ globals, node, edges }) {
  let nodeTemplate = useMemo(() => {
    return nodeTypeList.find((r) => r.type === node.type)
  }, [node.type])

  let core = useCore()

  let { on, send } = useMemo(() => {
    let on = (name, fnc) => {
      edges
        .filter((edge) => {
          return edge.target === node.id && edge.targetHandle === name
        })
        .map((edge) => {
          let hh = (ev) => {
            fnc(ev.detail)
          }
          window.addEventListener(edge.id, hh)
          globals.onClean(() => {
            window.removeEventListener(edge.id, hh)
          })
        })

      //
    }

    let send = (name, data) => {
      edges
        .filter((edge) => {
          return edge.source === node.id && edge.sourceHandle === name
        })
        .map((edge) => {
          window.dispatchEvent(new CustomEvent(`${edge.id}`, { detail: data }))
        })
    }

    return {
      send,
      on,
    }
  }, [edges, globals, node.id])

  useEffect(() => {
    let run = nodeTemplate?.run
    if (run) {
      run({
        core,
        globals,
        getNode() {
          return useFlow.getState().nodes.find((n) => n.id === node.id)
        },
        on,
        send,
      })
    }
  }, [core, nodeTemplate, node, globals, on, send])

  return (
    <>
      {/*  */}
      {/*  */}
      {/*  */}
    </>
  )
}
