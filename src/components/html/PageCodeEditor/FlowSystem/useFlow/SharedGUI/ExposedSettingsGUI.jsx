import { getTemplateByNodeInstance } from '../nodeTypes'
import { useFlow } from '../useFlow'

export function ExposedSettingsGUI() {
  let nodes = useFlow((s) => s.nodes)

  let groupNames = nodes.reduce((acc, item, key) => {
    if (!acc.includes(item.data.groupName) && item.data.groupName && item.data.isExposed) {
      acc.push(item.data.groupName)
    }

    return acc
  }, [])

  let onRender = (n) => {
    let template = getTemplateByNodeInstance(n)
    return (
      <div key={n.id} className='mb-5 border-b-2'>
        <div className='px-3 text-sm'>
          {n.type} - {n?.data?.label}
        </div>

        <div className='px-3 text-sm'>
          {template?.SettingsGUI && (
            <template.SettingsGUI isSettings={true} data={n.data} id={n.id}></template.SettingsGUI>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className='py-5'>
      {groupNames.map((name, i) => {
        return (
          <div key={name + i}>
            <div className='px-4 mb-3 text-center underline'>{name}</div>
            {nodes
              .filter((r) => name === r.data.groupName)
              .filter((r) => r.data.isExposed)
              .map(onRender)}
          </div>
        )
      })}

      {nodes.filter((r) => !groupNames.some((n) => n === r.data.groupName)).filter((r) => r.data.isExposed).length >
        0 && <div className='px-4 text-center underline'>No Group</div>}
      {nodes
        .filter((r) => !groupNames.some((n) => n === r.data.groupName))
        .filter((r) => r.data.isExposed)
        .map(onRender)}
    </div>
  )
}
