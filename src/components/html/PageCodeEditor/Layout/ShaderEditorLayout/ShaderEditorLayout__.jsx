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
          {/*  */}
          {/*  */}
          {/*  */}
        </HorizontalChildren>
        <HorizontalChildren className={'relative border-r'} width='calc(40%)'>
          {/*  */}
          {/*  */}
          {/*  */}
          {/*  */}
          {/*  */}
        </HorizontalChildren>
      </HorizontalParent>
    </div>
  )
}
