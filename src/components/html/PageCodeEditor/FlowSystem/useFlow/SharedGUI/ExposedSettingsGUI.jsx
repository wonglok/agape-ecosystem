import { getTemplateByNodeInstance } from '../nodeTypes'
import { useFlow } from '../useFlow'

export function ExposedSettingsGUI() {
  let nodes = useFlow((s) => s.nodes)

  return (
    <div>
      {nodes
        .filter((r) => r.data.isExposed)
        .map((n) => {
          let template = getTemplateByNodeInstance(n)
          return (
            <div key={n.id}>
              <div className='px-4 text-sm'>
                {n.type} - {n?.data?.label}
              </div>

              <>{template?.SettingsGUI && <template.SettingsGUI data={n.data} id={n.id}></template.SettingsGUI>}</>
            </div>
          )
        })}
    </div>
  )
}

//
