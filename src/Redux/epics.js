import { combineEpics } from 'redux-observable'
import { fetchSquadronData, fetchGreenieData } from '../modules/squadron/squadron.epic'
import { fetchPilotData } from '../modules/pilot/pilot.epic'
import { userLogin, userLoginFromToken, logout } from '../modules/login/login.epic'
import { userSignup } from '../modules/signup/signup.epic'
import { fetchUsersData, saveUserPermissions } from '../modules/users/users.epic'
import { fetchPilotsList, saveTrap, fetchLatestTraps, deleteTrap } from '../modules/lso/lso.epic'
import { fetchTrainingData } from '../modules/training/training.epic'
import { fetchLayoutData } from '../layouts/main.epic'

export default combineEpics(
  fetchSquadronData,
  fetchPilotData,
  fetchLayoutData,
  userLogin,
  userLoginFromToken,
  logout,
  userSignup,
  fetchUsersData,
  saveUserPermissions,
  fetchPilotsList,
  fetchTrainingData,
  saveTrap,
  fetchLatestTraps,
  deleteTrap,
  fetchGreenieData
)
