import { createAction, handleActions } from 'redux-actions'

export const types = {
  userSignup: 'USER_SIGNUP',
  userSignupSuccess: 'USER_SIGNUP_SUCCESS',
  userSignupError: 'USER_SIGNUP_ERROR',
}

export const userSignup = createAction(types.userSignup)
export const userSignupSuccess = createAction(types.userSignupSuccess)
export const userSignupError = createAction(types.userSignupError)

export const INITIAL_STATE = {
  loader: false,
  error: {},
}

export default handleActions(
  {
    [types.userSignup]: (state, { payload }) => {
      return {
        ...state,
        loader: true,
        error: {},
      }
    },
    [types.userSignupSuccess]: (state, { payload }) => {
      return {
        ...state,
        ...payload,
        loader: false,
        error: {},
      }
    },
    [types.userSignupError]: (state, { payload }) => {
      return {
        ...state,
        loader: false,
        error: payload,
      }
    },
  },
  INITIAL_STATE
)
