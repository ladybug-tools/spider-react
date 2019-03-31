// gbXML Reducer

const gbXMLDefaultState = {
  surfaceMeshes: true,
  surfaceEdges: true,
  surfaceOpenings: true,
  string: null
}

export default (state = gbXMLDefaultState, action) => {
  switch (action.type) {
    case 'TOGGLE':
      return {
        ...state,
        [action.toggle.name]: action.toggle.bool
      }

    case 'LOAD_STRING':
      return {
        ...state,
        string: action.string
      }

    default:
      return state;
  }
};
