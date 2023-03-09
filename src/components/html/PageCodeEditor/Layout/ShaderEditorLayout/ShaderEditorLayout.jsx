import { Graph3DEditor } from '../../Graph3D/Graph3DEditor/Graph3DEditor'
import { Graph3DViewer } from '../../Graph3D/Graph3DViewer/Graph3DViwer'
import { HorizontalChildren } from '../../Grid/HorizontalChildren'
import { HorizontalParent } from '../../Grid/HorizontalParent'

export function ShaderEditorLayout({ docName = false }) {
  //

  return (
    <div className='w-full h-full'>
      <HorizontalParent>
        <HorizontalChildren className={'relative border-r'} width='calc(20%)'>
          {/*  */}
          {/*  */}
          {/*  */}
          {/*  */}
        </HorizontalChildren>
        <HorizontalChildren className={'relative border-r'} width='calc(100% - 40%)'>
          {/*  */}
          <Graph3DEditor></Graph3DEditor>
          {/*  */}
          {/*  */}
          {/*  */}
        </HorizontalChildren>
        <HorizontalChildren className={'relative border-r'} width='calc(40%)'>
          {/*  */}
          <Graph3DViewer></Graph3DViewer>
          {/*  */}
          {/*  */}
          {/*  */}
          {/*  */}
        </HorizontalChildren>
      </HorizontalParent>
    </div>
  )
}
