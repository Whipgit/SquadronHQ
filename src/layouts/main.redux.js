import { createAction, handleActions } from 'redux-actions'
import daggy from 'daggy'

const LayoutData = daggy.taggedSum('LayoutData', {
  Empty: [],
  Data: [],
  Error: ['error'],
})

export const types = {
  fetchLayoutData: 'FETCH_LAYOUT_DATA',
  fetchLayoutDataSuccess: 'FETCH_LAYOUT_DATA_SUCCESS',
}

export const fetchLayoutData = createAction(types.fetchLayoutData)
export const fetchLayoutDataSuccess = createAction(types.fetchLayoutDataSuccess)

export const INITIAL_STATE = {
  data: LayoutData.Empty,
  layout: {},
}

export default handleActions(
  {
    [types.fetchLayoutData]: (state, { payload }) => {
      return {
        ...state,
        data: LayoutData.Empty,
      }
    },
    [types.fetchLayoutDataSuccess]: (state, { payload }) => {
      return {
        ...state,
        data: LayoutData.Data,
        layout: payload,
      }
    },
  },
  INITIAL_STATE
)
