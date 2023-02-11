import { Node } from 'reactflow'

export default [] as Node[]

export const DemoNodes = [
  {
    id: '1',
    type: 'ColorChooserNode',
    data: { color: '#4FD1C5' },
    position: { x: 250, y: 25 },
  },

  {
    id: '2',
    type: 'ColorChooserNode',
    data: { color: '#F6E05E' },
    position: { x: 100, y: 125 },
  },
  {
    id: '3',
    type: 'ColorChooserNode',
    data: { color: '#B794F4' },
    position: { x: 250, y: 250 },
  },
]
