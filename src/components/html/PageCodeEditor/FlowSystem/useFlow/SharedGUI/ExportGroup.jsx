import { useDrag } from '@use-gesture/react'
import { useState } from 'react'
import { useReactFlow } from 'reactflow'

export function ExportGroup(node) {
  let [size, setSize] = useState({ width: node.data.width || 500, height: node.data.height || 500 })
  let [init, setInit] = useState({ width: node.data.width || 500, height: node.data.height || 500 })
  const bind = useDrag((state) => {
    if (state.first) {
      setInit({ width: node.data.width || 500, height: node.data.height || 500 })
    } else {
      // console.log(state.initial)

      node.data.width = init.width + state.movement[0]
      node.data.height = init.height + state.movement[1]
      setSize({ width: node.data.width, height: node.data.height })
    }
  }, {})

  let { getIntersectingNodes, getEdges } = useReactFlow()
  return (
    <div
      style={{
        width: `${size.width.toFixed(0)}px`,
        height: `${size.height.toFixed(0)}px`,
        position: 'relative',
        backgroundColor: `rgba(255,0,0,0.1)`,
      }}>
      <div className='absolute top-0 left-0 w-full text-center'>
        <button
          className='px-5 py-2 m-4 bg-gray-200 rounded-2xl'
          onClick={() => {
            //
            const intersections = getIntersectingNodes(node)
            const edges = getEdges()

            let okEdges = edges.filter((ed) => {
              return intersections.some((r) => r.id === ed.target || r.id === ed.source)
            })

            let okNodes = intersections

            console.log(node)
            let data = {
              edges: okEdges,
              nodes: [...okNodes, node],
            }

            let a = document.createElement('a')
            a.href = URL.createObjectURL(new Blob([JSON.stringify(data)], { type: 'application/json' }))
            a.download = 'backup.json'
            a.click()

            //
          }}>
          Download Backup
        </button>
      </div>
      <div {...bind()} className='absolute bottom-0 right-0 w-8 h-8 bg-red-500 nodrag touch-none'></div>
    </div>
  )
}
export default ExportGroup