import { useEffect } from 'react'
import { FlowSystemEditor } from '../../FlowSystem/FlowSystemEditor/FlowSystemEditor'
import { FlowSystemRunner } from '../../FlowSystem/FlowSystemRunner/FlowSystemRunner'
import { HorizontalChildren } from '../../Grid/HorizontalChildren'
import { HorizontalParent } from '../../Grid/HorizontalParent'
import { useFlow } from '../../FlowSystem/useFlow/useFlow'
import { ExposedSettingsGUI } from '../../FlowSystem/useFlow/SharedGUI/ExposedSettingsGUI'
import { createData } from '../../FlowSystem/useFlow/Nodes/Capsule/Capsule'
import { getID } from '@/backend/aws'

export function ShaderEditorLayout() {
  let openFile = useFlow((s) => s.openFile)
  // let ready = useFlow((s) => s.ready)
  let docName = 'docNameNew'
  useEffect(() => {
    return openFile({ docName })
  }, [docName, openFile])

  //
  return (
    <div className='w-full h-full'>
      <HorizontalParent>
        <HorizontalChildren className={'relative border-gray-400 border-r'} width='calc(20%)'>
          <ExposedSettingsGUI></ExposedSettingsGUI>
        </HorizontalChildren>
        <HorizontalChildren className={'relative'} width='calc(100% - 40%)'>
          <FlowSystemEditor></FlowSystemEditor>

          <div className='absolute top-0 left-0'>
            <button
              className='px-4 py-1 m-1 text-xs text-white bg-gray-700 rounded-2xl'
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
                      let nodeForEncap = createData()
                      nodeForEncap.id = getID()
                      nodeForEncap.data.nodes = obj.nodes
                      nodeForEncap.data.edges = obj.edges
                      useFlow.setState({ nodes: [nodeForEncap], edges: [] })
                    }
                    firstReader.readAsText(first)
                  }
                }
                input.click()
              }}>
              Load Encapsule
            </button>

            <button
              className='px-4 py-1 m-1 text-xs text-white bg-gray-700 rounded-2xl'
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
                    }
                    firstReader.readAsText(first)
                  }
                }
                input.click()
              }}>
              Load All
            </button>

            <button
              className='px-4 py-1 m-1 text-xs text-white bg-gray-700 rounded-2xl'
              onClick={() => {
                //

                let st = useFlow.getState()
                st.nodes.unshift({
                  id: getID(),
                  type: 'ExportGroup',
                  data: { label: 'Group', width: 500, height: 500 },
                  position: { x: 0, y: 0 },
                  style: { zIndex: -1 },
                })
                st.nodes = st.nodes.slice().sort((a, b) => {
                  if (a.type.includes('group') || b.type.includes('group')) {
                    return 1
                  } else if (a.type.includes('group') && !b.type.includes('group')) {
                    return -1
                  } else {
                    return 0
                  }
                })

                useFlow.setState({ edges: [...st.edges], nodes: [...st.nodes] })
              }}>
              Export Group
            </button>
          </div>
        </HorizontalChildren>

        <HorizontalChildren className={'relative'} width='calc(40%)'>
          <FlowSystemRunner></FlowSystemRunner>
        </HorizontalChildren>
      </HorizontalParent>
    </div>
  )
}
