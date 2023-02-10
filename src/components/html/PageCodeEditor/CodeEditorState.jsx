import { proxy, useSnapshot } from 'valtio'

export const CEState = proxy({
  tabAt: 'codePage',
})

let noop = () => {}
export const useCEStore = () => {
  let snap = useSnapshot(CEState)
  noop(snap)
  return CEState
}
