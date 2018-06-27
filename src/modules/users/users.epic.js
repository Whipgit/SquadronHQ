import '../../rxjs-operators'
import { types, fetchUsersDataSuccess } from './users.reducer'
import { users } from '../../firebase.js'

const getUsers = () => {
  return users.get().then(users => {
    const usersArray = []
    users.forEach(user => usersArray.push(user.data()))
    return usersArray
  })
}

export const fetchUsersData = action$ =>
  action$
    .ofType(types.fetchUsersData)
    .switchMap(action => getUsers(action.payload).then(users => fetchUsersDataSuccess(users)))

export const saveUserPermissions = action$ =>
  action$
    .ofType(types.fetchUsersData)
    .switchMap(action => getUsers(action.payload).then(users => fetchUsersDataSuccess(users)))
