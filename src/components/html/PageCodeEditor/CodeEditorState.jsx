import { proxy, useSnapshot } from 'valtio'

export const CEState = proxy({
  tabAt: 'shaders',
})

let runningThis = () => {}
export const useCEStore = () => {
  let snap = useSnapshot(CEState)
  runningThis(snap)
  return CEState
}
