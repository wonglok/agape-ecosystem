import { RunEdge } from './RunEdge/RunEdge'
import { RunNode } from './RunNode/RunNode'
import { useCore } from './useCore/useCore'

export function RunnerObject({ nodes, edges }) {
  //
  let globals = useCore()
  return (
    <>
      {nodes &&
        nodes.map((n) => {
          return <RunNode globals={globals} edges={edges} node={n} key={n.id}></RunNode>
        })}

      {/* {edges &&
        edges.map((e) => {
          return <RunEdge globals={globals} edge={e} key={e.id}></RunEdge>
        })} */}
    </>
  )
}
