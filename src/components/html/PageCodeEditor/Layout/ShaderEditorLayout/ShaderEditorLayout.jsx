import NodeFlow from '../../DoHow/ReactFlow/NodeFlow'
import { HorizontalChildren } from '../../Grid/HorizontalChildren'
import { HorizontalParent } from '../../Grid/HorizontalParent'

export function ShaderEditorLayout() {
  return (
    <div className='w-full h-full'>
      <HorizontalParent>
        <HorizontalChildren width='calc(100% - 100px)'>
          <NodeFlow></NodeFlow>
        </HorizontalChildren>
        <HorizontalChildren className={'border-l border-gray-500'} width='calc(100px)'>
          Test
        </HorizontalChildren>
      </HorizontalParent>
    </div>
  )
}
