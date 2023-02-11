import { proxy, useSnapshot } from 'valtio'

export const CEState = proxy({
  tabAt: 'test',
})

let noop = () => {}
export const useCEStore = () => {
  let snap = useSnapshot(CEState)
  noop(snap)
  return CEState
}
