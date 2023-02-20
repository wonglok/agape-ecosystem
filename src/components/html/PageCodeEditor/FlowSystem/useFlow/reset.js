export default {
  edges: [
    {
      source: '_0708fe14feb877b796bcff93844f33a0',
      sourceHandle: 'number',
      target: '_3f5c1164b9479eb2cc71a56334a58284',
      targetHandle: 'metalness',
      type: 'CloseEdge',
      id: 'reactflow__edge-_0708fe14feb877b796bcff93844f33a0number-_3f5c1164b9479eb2cc71a56334a58284metalness',
      selected: false,
      animated: false,
      style: { stroke: '' },
    },
    {
      source: '_3f5c1164b9479eb2cc71a56334a58284',
      sourceHandle: 'material',
      target: '_1cc2847db7ed4036d75ac9a0473a512c',
      targetHandle: 'material',
      type: 'CloseEdge',
      id: 'reactflow__edge-_3f5c1164b9479eb2cc71a56334a58284material-_1cc2847db7ed4036d75ac9a0473a512cmaterial',
      animated: false,
      style: { stroke: '' },
    },
    {
      source: '_a7a4a4ad8ef00e8f3ed49cbaf59b4156',
      sourceHandle: 'number',
      target: '_3f5c1164b9479eb2cc71a56334a58284',
      targetHandle: 'thickness',
      type: 'CloseEdge',
      id: 'reactflow__edge-_a7a4a4ad8ef00e8f3ed49cbaf59b4156number-_3f5c1164b9479eb2cc71a56334a58284thickness',
      animated: false,
      style: { stroke: '' },
    },
    {
      source: '_ae0e89227dede443f9e2e05ac21db90c',
      sourceHandle: 'color',
      target: '_3f5c1164b9479eb2cc71a56334a58284',
      targetHandle: 'color',
      type: 'CloseEdge',
      id: 'reactflow__edge-_ae0e89227dede443f9e2e05ac21db90ccolor-_3f5c1164b9479eb2cc71a56334a58284color',
      animated: false,
      style: { stroke: '' },
    },
    {
      source: '_092dc43c73c1d7906e93f17ae7254e32',
      sourceHandle: 'number',
      target: '_3f5c1164b9479eb2cc71a56334a58284',
      targetHandle: 'ior',
      type: 'CloseEdge',
      id: 'reactflow__edge-_092dc43c73c1d7906e93f17ae7254e32number-_3f5c1164b9479eb2cc71a56334a58284ior',
      animated: false,
      style: { stroke: '' },
    },
    {
      id: '_6e4f149033a0e25bf10cc5a447f8651d',
      source: '_158c80b437120b6f815b740fdbe6c82e',
      sourceHandle: 'number',
      target: '_3f5c1164b9479eb2cc71a56334a58284',
      targetHandle: 'transmission',
      type: 'CloseEdge',
      animated: false,
      style: { stroke: '' },
    },
    {
      source: '_70dd22e723f19e7b4789c5f433fd8799',
      sourceHandle: 'geometry',
      target: '_1cc2847db7ed4036d75ac9a0473a512c',
      targetHandle: 'geometry',
      type: 'CloseEdge',
      id: 'reactflow__edge-_70dd22e723f19e7b4789c5f433fd8799geometry-_1cc2847db7ed4036d75ac9a0473a512cgeometry',
      animated: false,
      style: { stroke: '' },
    },
    {
      id: '_b4bc56e93546f54b79f00fd1855aaab1',
      source: '_ad2cdaddf00dc4fcda901d6f14ef3e3a',
      sourceHandle: 'number',
      target: '_3f5c1164b9479eb2cc71a56334a58284',
      targetHandle: 'roughness',
      type: 'CloseEdge',
      animated: false,
      style: { stroke: '' },
    },
  ],
  nodes: [
    {
      type: 'Mesh',
      data: { label: 'meshItem1', color: '#a0a0a0' },
      position: { x: 250, y: 660 },
      id: '_1cc2847db7ed4036d75ac9a0473a512c',
      width: 193,
      height: 42,
      selected: false,
      positionAbsolute: { x: 250, y: 660 },
      dragging: false,
    },
    {
      type: 'ColorPicker',
      data: {
        label: 'colorPicker1',
        color: '#ffb3b3',
        isExposed: true,
        isGroupedForExpose: true,
        groupName: 'awesome',
      },
      position: { x: -340, y: -150 },
      id: '_ae0e89227dede443f9e2e05ac21db90c',
      width: 321,
      height: 42,
      selected: false,
      positionAbsolute: { x: -340, y: -150 },
      dragging: false,
    },
    {
      type: 'NumberPicker',
      data: {
        label: 'transmission',
        number: 0,
        slider: 1,
        isExposed: true,
        isGroupedForExpose: true,
        groupName: 'awesome',
        float0: 1,
      },
      position: { x: -340, y: -50 },
      id: '_158c80b437120b6f815b740fdbe6c82e',
      width: 249,
      height: 124,
      selected: false,
      positionAbsolute: { x: -340, y: -50 },
      dragging: false,
    },
    {
      type: 'NumberPicker',
      data: { label: 'thickness', number: 0, slider: 2.14, isExposed: true, isGroupedForExpose: false, float0: 2.5 },
      position: { x: -350, y: 240 },
      id: '_a7a4a4ad8ef00e8f3ed49cbaf59b4156',
      width: 249,
      height: 124,
      selected: false,
      positionAbsolute: { x: -350, y: 240 },
      dragging: false,
    },
    {
      type: 'NumberPicker',
      data: { label: 'roughness', number: 0, slider: 0, float0: 0 },
      position: { x: -380, y: 400 },
      id: '_ad2cdaddf00dc4fcda901d6f14ef3e3a',
      width: 249,
      height: 124,
      selected: false,
      positionAbsolute: { x: -380, y: 400 },
      dragging: false,
    },
    {
      type: 'NumberPicker',
      data: { label: 'metalness', number: 0, slider: 0, isExposed: false, float0: 0 },
      position: { x: -320, y: 590 },
      id: '_0708fe14feb877b796bcff93844f33a0',
      width: 249,
      height: 124,
      selected: false,
      positionAbsolute: { x: -320, y: 590 },
      dragging: false,
    },
    {
      type: 'PhysicalMaterial',
      data: { label: 'materialPhysical1', color: '#a0a0a0', isExposed: false },
      position: { x: 210, y: -70 },
      id: '_3f5c1164b9479eb2cc71a56334a58284',
      width: 193,
      height: 194,
      selected: false,
      positionAbsolute: { x: 210, y: -70 },
      dragging: false,
    },
    {
      type: 'NumberPicker',
      data: {
        label: 'indexOfRefarction',
        number: 0,
        slider: 1.46,
        isExposed: true,
        isGroupedForExpose: true,
        float0: 1.5,
      },
      position: { x: -350, y: 100 },
      id: '_092dc43c73c1d7906e93f17ae7254e32',
      width: 249,
      height: 124,
      selected: false,
      positionAbsolute: { x: -350, y: 100 },
      dragging: false,
    },
    {
      type: 'TorusKnotBufferGeometry',
      data: { label: 'torusKnotGeometry1', color: '#a0a0a0' },
      position: { x: 100, y: 440 },
      id: '_70dd22e723f19e7b4789c5f433fd8799',
      width: 193,
      height: 42,
      selected: false,
      positionAbsolute: { x: 100, y: 440 },
      dragging: false,
    },
  ],
}
