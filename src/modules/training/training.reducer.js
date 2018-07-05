import { createAction, handleActions } from 'redux-actions'
import daggy from 'daggy'

const RosterData = daggy.taggedSum('RosterData', {
  Empty: [],
  Data: [],
  Error: ['error'],
})

export const types = {
  fetchTrainingData: 'FETCH_TRAINING_DATA',
  fetchTrainingDataSuccess: 'FETCH_TRAINING_DATA_SUCCESS',
}

export const fetchTrainingData = createAction(types.fetchTrainingData)
export const fetchTrainingDataSuccess = createAction(types.fetchTrainingDataSuccess)

export const INITIAL_STATE = {
  data: RosterData.Empty,
  training: {},
}

export default handleActions(
  {
    [types.fetchTrainingData]: (state, { payload }) => {
      return {
        ...state,
        data: RosterData.Empty,
      }
    },
    [types.fetchTrainingDataSuccess]: (state, { payload }) => {
      return {
        ...state,
        data: RosterData.Data,
        training: {
          ...payload,
        },
      }
    },
  },
  INITIAL_STATE
)
