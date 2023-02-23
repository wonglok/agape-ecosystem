import { useRef, useState } from 'react'
import { RunNode } from './RunNode/RunNode'
import { useCore } from './useCore/useCore'

export function RunnerObject({ globals, nodes, edges }) {
  let scope = useCore()
  let [readyMap] = useState(() => new Map())
  return (
    <>
      {nodes &&
        nodes.map((n) => {
          return (
            <RunNode
              globals={globals || scope}
              readyMap={readyMap}
              scope={scope}
              nodes={nodes}
              edges={edges}
              node={n}
              key={n.id}></RunNode>
          )
        })}

      {/* {edges &&
        edges.map((e) => {
          return <RunEdge globals={globals} edge={e} key={e.id}></RunEdge>
        })} */}
    </>
  )
}
