import '../../rxjs-operators'
import { types, fetchPilotsListSuccess } from './lso.reducer'
import { users } from '../../firebase.js'
import axios from 'axios/index'

const getPilotsList = () =>
  axios({
    method: 'get',
    url: 'https://us-central1-squadronhq-b1fdd.cloudfunctions.net/pilotList',
  }).then(item => {
    return item
  })

const saveUser = ({ user, field, val }) => {
  const userToSave = { ...user }
  userToSave[field] = val
  return users.doc(user.uid).set(userToSave)
}

export const fetchPilotsList = action$ =>
  action$
    .ofType(types.fetchPilotsList)
    .switchMap(action => getPilotsList(action.payload).then(users => fetchPilotsListSuccess(users.data)))

export const saveUserPermissions = action$ =>
  action$.ofType(types.saveUserPermissions).switchMap(action =>
    saveUser(action.payload).then(res => {
      return { type: 'NOTHING' }
    })
  )
