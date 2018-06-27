import { createAction, handleActions } from 'redux-actions'
import daggy from 'daggy'

const UsersData = daggy.taggedSum('UsersData', {
  Empty: [],
  Data: [],
  Error: ['error'],
})

export const types = {
  fetchUsersData: 'FETCH_USERS_DATA',
  fetchUsersDataSuccess: 'FETCH_USERS_DATA_SUCCESS',
  saveUserPermissions: 'SAVE_USER_PERMISSIONS',
}

export const fetchUsersData = createAction(types.fetchUsersData)
export const fetchUsersDataSuccess = createAction(types.fetchUsersDataSuccess)
export const saveUserPermissions = createAction(types.saveUserPermissions)

export const INITIAL_STATE = {
  data: UsersData.Empty,
  users: [],
}

export default handleActions(
  {
    [types.fetchUsersData]: (state, { payload }) => {
      return {
        ...state,
        data: UsersData.Empty,
      }
    },
    [types.fetchUsersDataSuccess]: (state, { payload }) => {
      return {
        ...state,
        users: payload,
        data: UsersData.Data,
      }
    },
  },
  INITIAL_STATE
)
