import { useOnSelectionChange } from 'reactflow'

export function OnSpace({ nodes, edges }) {
  useOnSelectionChange({
    onChange: ({ nodes, edges }) => {
      console.log('changed selection', nodes, edges)
    },
  })

  return null
}
