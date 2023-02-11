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
          let item = content.reduce((r, val, key) => {
            r += 1 + key
            return r
          }, 0)
          contentYA.push([item])
        }}>
        push
      </div>

      <pre className='overflow-auto h-96'>{JSON.stringify(content.slice().reverse(), null, '  ')}</pre>
    </div>
  )
}
