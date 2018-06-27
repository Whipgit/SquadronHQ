import { combineEpics } from 'redux-observable'
import { fetchSquadronData } from '../modules/squadron/squadron.epic'
import { fetchPilotData } from '../modules/pilot/pilot.epic'
import { userLogin, userLoginFromToken, logout } from '../modules/login/login.epic'
import { userSignup } from '../modules/signup/signup.epic'
import { fetchUsersData } from '../modules/users/users.epic'
import { fetchLayoutData } from '../layouts/main.epic'

export default combineEpics(
  fetchSquadronData,
  fetchPilotData,
  fetchLayoutData,
  userLogin,
  userLoginFromToken,
  logout,
  userSignup,
  fetchUsersData
)
