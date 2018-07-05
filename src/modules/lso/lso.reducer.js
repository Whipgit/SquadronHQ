import { createAction, handleActions } from 'redux-actions'
import daggy from 'daggy'
import { sort } from 'ramda'
import { escapeRegExp, filter } from 'lodash'

const UsersData = daggy.taggedSum('UsersData', {
  Empty: [],
  Data: [],
  Error: ['error'],
})

export const types = {
  fetchPilotsList: 'FETCH_PILOTS_LIST',
  fetchPilotsListSuccess: 'FETCH_PILOTS_LIST_SUCCESS',
  trimPilot: 'TRIM_PILOT_SEARCH',
  resetPilot: 'RESET_PILOT_SEARCH',
  trimLso: 'TRIM_LSO_SEARCH',
  resetLso: 'RESET_LSO_SEARCH',
  saveUserPermissions: 'SAVE_USER_PERMISSIONS',
}

export const fetchPilotsList = createAction(types.fetchPilotsList)
export const fetchPilotsListSuccess = createAction(types.fetchPilotsListSuccess)
export const trimPilot = createAction(types.trimPilot)
export const resetPilot = createAction(types.resetPilot)
export const trimLso = createAction(types.trimLso)
export const resetLso = createAction(types.resetLso)
export const saveUserPermissions = createAction(types.saveUserPermissions)

export const INITIAL_STATE = {
  data: UsersData.Empty,
  pilotList: [],
  pilot: [],
  lso: [],
}

export default handleActions(
  {
    [types.fetchPilotsList]: (state, { payload }) => {
      return {
        ...state,
        data: UsersData.Empty,
      }
    },
    [types.fetchPilotsListSuccess]: (state, { payload }) => {
      return {
        ...state,
        pilotList: [...payload],
        pilot: [...payload],
        lso: [...payload],
        data: UsersData.Data,
      }
    },
    [types.trimPilot]: (state, { payload }) => {
      const re = new RegExp(escapeRegExp(payload), 'i')
      const isMatch = result => re.test(result.title)
      return {
        ...state,
        pilot: [...state.pilotList.filter(isMatch)],
      }
    },
    [types.resetPilot]: (state, { payload }) => {
      return {
        ...state,
        pilot: [...state.pilotList],
      }
    },
    [types.trimLso]: (state, { payload }) => {
      const re = new RegExp(escapeRegExp(payload), 'i')
      const isMatch = result => re.test(result.title)
      return {
        ...state,
        lso: [...state.pilotList.filter(isMatch)],
      }
    },
    [types.resetLso]: (state, { payload }) => {
      return {
        ...state,
        lso: [...state.pilotList],
      }
    },
    [types.saveUserPermissions]: (state, { payload: { user, field, val } }) => {
      return {
        ...state,
        users: state.users.map(account => {
          if (account.email === user.email) {
            account[field] = val
          }
          return account
        }),
      }
    },
  },
  INITIAL_STATE
)
