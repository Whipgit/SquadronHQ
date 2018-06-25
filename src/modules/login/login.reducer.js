import { createAction, handleActions } from 'redux-actions'
import daggy from 'daggy'

const Loader = daggy.taggedSum('loader', {
  True: [],
  False: [],
})

const Authenticated = daggy.taggedSum('authenticated', {
  True: [],
  False: [],
})

export const types = {
  userLogin: 'USER_LOGIN',
  userLoginSuccess: 'USER_LOGIN_SUCCESS',
  userLoginError: 'USER_LOGIN_ERROR',
  userLoginFromToken: 'USER_LOGIN_FROM_TOKEN',
  logout: 'USER_LOGOUT',
}

export const userLogin = createAction(types.userLogin)
export const userLoginSuccess = createAction(types.userLoginSuccess)
export const userLoginError = createAction(types.userLoginError)
export const userLoginFromToken = createAction(types.userLoginFromToken)
export const logout = createAction(types.logout)

export const INITIAL_STATE = {
  loader: false,
  authenticated: false,
  profile: {},
  error: {},
}

export default handleActions(
  {
    [types.userLogin]: (state, { payload }) => {
      return {
        ...state,
        loader: true,
        authenticated: false,
        error: {},
      }
    },
    [types.userLoginSuccess]: (state, { payload }) => {
      return {
        ...state,
        ...payload,
        loader: false,
        authenticated: true,
        error: {},
      }
    },
    [types.userLoginError]: (state, { payload }) => {
      return {
        ...state,
        loader: false,
        authenticated: false,
        error: payload,
      }
    },
    [types.logout]: (state, { payload }) => {
      return {
        loader: false,
        authenticated: false,
        error: {},
      }
    },
  },
  INITIAL_STATE
)
