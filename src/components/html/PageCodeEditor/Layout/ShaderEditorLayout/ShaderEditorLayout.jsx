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

          <div className='absolute top-0 left-0'>
            <button
              onClick={() => {
                let st = useFlow.getState()
                let data = {
                  edges: st.edges,
                  nodes: st.nodes,
                }

                let a = document.createElement('a')
                a.href = URL.createObjectURL(new Blob([JSON.stringify(data)], { type: 'application/json' }))
                a.download = 'backup.json'
                a.click()
                // useFlow.getState().resetDemo()
              }}>
              Download
            </button>
            <button
              onClick={() => {
                let input = document.createElement('input')
                input.type = 'file'
                input.onchange = ({
                  target: {
                    files: [first],
                  },
                }) => {
                  if (first) {
                    let firstReader = new FileReader()
                    firstReader.onload = () => {
                      let obj = JSON.parse(firstReader.result)

                      useFlow.setState({ edges: obj.edges, nodes: obj.nodes })
                      console.log(obj)
                    }
                    firstReader.readAsText(first)
                  }
                }
                input.click()
                // let st = useFlow.getState()
                // let data = {
                //   edges: st.edges,
                //   nodes: st.nodes,
                // }
                // let a = document.createElement('a')
                // a.href = URL.createObjectURL(new Blob([JSON.stringify(data)], { type: 'application/json' }))
                // a.download = 'backup.json'
                // a.click()
                // useFlow.getState().resetDemo()
              }}>
              Restore
            </button>
          </div>
        </HorizontalChildren>
        {/* border-l border-gray-500 */}
        <HorizontalChildren className={'relative'} width='calc(50%)'>
          <FlowSystemRunner></FlowSystemRunner>
        </HorizontalChildren>
      </HorizontalParent>
    </div>
  )
}
