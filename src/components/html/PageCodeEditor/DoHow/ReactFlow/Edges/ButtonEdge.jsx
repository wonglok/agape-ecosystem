import React from 'react'
import { getBezierPath } from 'reactflow'

import './index.css'

const foreignObjectSize = 40

const onEdgeClick = (evt, id) => {
  evt.stopPropagation()
  alert(`remove ${id}`)
}

export default function CustomEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
}) {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  })

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: /* css */ `
.edgebutton {
  width: 20px;
  height: 20px;
  background: #eee;
  border: 1px solid #fff;
  cursor: pointer;
  border-radius: 50%;
  font-size: 12px;
  line-height: 1;
}

.edgebutton:hover {
  box-shadow: 0 0 6px 2px rgba(0, 0, 0, 0.08);
}

.edgebutton-foreignobject div {
  background: transparent;
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 40px;
}
    `,
        }}></style>
      <path id={id} style={style} className='react-flow__edge-path' d={edgePath} markerEnd={markerEnd} />
      <foreignObject
        width={foreignObjectSize}
        height={foreignObjectSize}
        x={labelX - foreignObjectSize / 2}
        y={labelY - foreignObjectSize / 2}
        className='edgebutton-foreignobject'
        requiredExtensions='http://www.w3.org/1999/xhtml'>
        <div>
          <button className='edgebutton' onClick={(event) => onEdgeClick(event, id)}>
            ×
          </button>
        </div>
      </foreignObject>
    </>
  )
}