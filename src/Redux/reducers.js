import { combineReducers } from 'redux'
import { reducer as formReducer } from 'redux-form'
import layout from '../layouts/main.redux'
import squadron from '../modules/squadron/squadron.reducer'
import pilot from '../modules/pilot/pilot.reducer'
import user from '../modules/login/login.reducer'
import signup from '../modules/signup/signup.reducer'
import users from '../modules/users/users.reducer'
import lso from '../modules/lso/lso.reducer'
import training from '../modules/training/training.reducer'

export default combineReducers({
  layout,
  squadron,
  pilot,
  user,
  signup,
  users,
  lso,
  training,
  form: formReducer,
})
