import { useFlow } from '../../useFlow/useFlow'
import { RunNode } from './RunNode/RunNode'
import { useCore } from './useCore/useCore'

export function RunnerObject({ globals, emit = () => {}, nodes, edges }) {
  let scope = useCore()
  let refresher = useFlow((s) => s.refresher)

  // console.log(refresher)
  return (
    <>
      {nodes &&
        nodes.map((n) => {
          return (
            <RunNode
              globals={globals || scope}
              emit={emit}
              scope={scope}
              nodes={nodes}
              edges={edges}
              node={n}
              key={n.id + refresher}></RunNode>
          )
        })}

      {/*  */}
      {/* {edges &&
        edges.map((e) => {
          return <RunEdge globals={globals} edge={e} key={e.id}></RunEdge>
        })} */}
    </>
  )
}
