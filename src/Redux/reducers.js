import { combineReducers } from 'redux'
import { reducer as formReducer } from 'redux-form'
import layout from '../layouts/main.redux'
import squadron from '../modules/squadron/squadron.reducer'
import pilot from '../modules/pilot/pilot.reducer'

export default combineReducers({
  layout,
  squadron,
  pilot,
  form: formReducer,
})
