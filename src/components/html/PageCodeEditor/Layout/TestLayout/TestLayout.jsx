import { useEffect, useState } from 'react'
import { useRealtime } from '../../DoHow/Realtime/Realtime'

export function TestLayout() {
  //
  let openDoc = useRealtime((s) => {
    return s.openDoc
  })
  let contentYA = useRealtime((s) => {
    return s.contentYA
  })

  let [content, setCotent] = useState([])

  useEffect(() => {
    if (!contentYA) {
      return
    }
    return contentYA.observe((it) => {
      //

      console.log(contentYA.toArray())
      setCotent(contentYA.toArray())
    })
  }, [contentYA])

  useEffect(() => {
    return openDoc()
  }, [])

  return (
    <div>
      <div
        onClick={() => {
          contentYA.push([
            content.reduce((r, val) => {
              r += val
              return r
            }, 0),
          ])
        }}>
        push
      </div>

      {JSON.stringify(content)}
    </div>
  )
}
