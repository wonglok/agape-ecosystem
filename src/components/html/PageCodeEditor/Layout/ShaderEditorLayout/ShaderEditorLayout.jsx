import { useEffect } from 'react'
import { FlowSystemEditor } from '../../FlowSystem/FlowSystemEditor/FlowSystemEditor'
import { FlowSystemRunner } from '../../FlowSystem/FlowSystemRunner/FlowSystemRunner'
import { HorizontalChildren } from '../../Grid/HorizontalChildren'
import { HorizontalParent } from '../../Grid/HorizontalParent'
import { useFlow } from '../../FlowSystem/useFlow/useFlow'
import { Loading } from '../Loading/Loading'

export function ShaderEditorLayout() {
  let openFile = useFlow((s) => s.openFile)
  let ready = useFlow((s) => s.ready)
  let docName = 'docNameNew'
  useEffect(() => {
    return openFile({ docName })
  }, [docName, openFile])

  //
  return (
    <div className='w-full h-full'>
      <HorizontalParent>
        <HorizontalChildren className={'relative'} width='calc(100% - 50%)'>
          <FlowSystemEditor></FlowSystemEditor>

          <button
            className='absolute top-0 left-0'
            onClick={() => {
              useFlow.getState().resetDemo()
            }}>
            Button
          </button>
        </HorizontalChildren>
        {/* border-l border-gray-500 */}
        <HorizontalChildren className={'relative'} width='calc(50%)'>
          <FlowSystemRunner></FlowSystemRunner>
        </HorizontalChildren>
      </HorizontalParent>
    </div>
  )
}
