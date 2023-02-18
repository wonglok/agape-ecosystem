import { FlowSystemEditor } from '../../FlowSystem/FlowSystemEditor/FlowSystemEditor'
import { FlowSystemRunner } from '../../FlowSystem/FlowSystemRunner/FlowSystemRunner'
import { HorizontalChildren } from '../../Grid/HorizontalChildren'
import { HorizontalParent } from '../../Grid/HorizontalParent'

export function ShaderEditorLayout() {
  return (
    <div className='w-full h-full'>
      <HorizontalParent>
        <HorizontalChildren width='calc(100% - 50%)'>
          <FlowSystemRunner></FlowSystemRunner>
        </HorizontalChildren>
        <HorizontalChildren className={'border-l border-gray-500'} width='calc(50%)'>
          <FlowSystemEditor></FlowSystemEditor>
        </HorizontalChildren>
      </HorizontalParent>
    </div>
  )
}
