import { useDrag } from '@use-gesture/react'
import { useState } from 'react'
import { useReactFlow } from 'reactflow'

export function ExportGroup(node) {
  let { getIntersectingNodes, getEdges, getNodes, getZoom } = useReactFlow()
  let [canSel, setSel] = useState('')

  let [size, setSize] = useState({ width: node.data.width || 500, height: node.data.height || 500 })
  let [init, setInit] = useState({ width: node.data.width || 500, height: node.data.height || 500 })
  const bind = useDrag((state) => {
    if (state.first) {
      setInit({ width: node.data.width || 500, height: node.data.height || 500 })
    } else {
      // console.log(state.initial)

      node.data.width = init.width + state.movement[0] / getZoom()
      node.data.height = init.height + state.movement[1] / getZoom()
      setSize({ width: node.data.width, height: node.data.height })
    }
  }, {})

  return (
    <>
      <div
        className={'export-group ' + (canSel ? '' : 'nodrag')}
        style={{
          width: `${size.width.toFixed(0)}px`,
          height: `2px`, //${size.height.toFixed(0)}px
          position: 'relative',
          backgroundColor: `rgba(255,0,0,1)`,
        }}>
        <div className='absolute top-0 left-0 w-full p-3 text-center bg-blue-300'>
          <button
            className='px-5 py-2 m-4 bg-gray-200 rounded-2xl'
            onClick={() => {
              //
              const intersections = getIntersectingNodes(node)
              const edges = getEdges()

              let okEdges = edges.filter((ed) => {
                return intersections.some((r) => r.id === ed.target || r.id === ed.source)
              })

              let node2 = getNodes().find((r) => r.id === node.id)
              let okNodes = intersections

              let data = {
                edges: okEdges,
                nodes: [...okNodes, node2],
              }

              let a = document.createElement('a')
              a.href = URL.createObjectURL(new Blob([JSON.stringify(data)], { type: 'application/json' }))
              a.download = 'backup.json'
              a.click()

              //
            }}>
            Download Grouped JSON
          </button>
          <button
            className={'px-5 py-2 m-4 rounded-2xl ' + (!canSel ? 'bg-blue-500' : 'bg-gray-200')}
            onClick={() => {
              setSel((s) => !s)
            }}>
            {canSel ? 'Toggle Lock' : 'Locked'}
          </button>

          <button></button>
        </div>
      </div>
      <div
        style={{
          width: `${size.width.toFixed(0)}px`,
          position: 'absolute',
          left: `0px`,
          height: '2px',
          backgroundColor: 'red',
          top: `${size.height.toFixed(0)}px`,
        }}>
        <div {...bind()} className='absolute bottom-0 right-0 w-8 h-8 bg-red-500 nodrag touch-none'></div>
      </div>
      <div
        style={{
          height: `${size.height.toFixed(0)}px`,
          position: 'absolute',
          left: `0px`,
          width: '2px',
          backgroundColor: 'red',
          top: `${(size.height * 0.0).toFixed(0)}px`,
        }}></div>
      <div
        style={{
          height: `${size.height.toFixed(0)}px`,
          left: `${size.width.toFixed(0)}px`,
          position: 'absolute',
          width: '2px',
          backgroundColor: 'red',
          top: `${(size.height * 0.0).toFixed(0)}px`,
        }}></div>

      <div
        style={{
          top: `0px`,
          width: `${size.width.toFixed(0)}px`,
          position: 'absolute',
          height: '2px',
          backgroundColor: 'red',
        }}></div>
    </>
  )
}
export default ExportGroup
