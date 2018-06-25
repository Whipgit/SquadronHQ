import '../../rxjs-operators'
import { types, userLoginSuccess, userLoginError } from './login.reducer'
import cookies from 'react-cookies'
import { auth, users } from '../../firebase.js'

const login = ({ email, password }) => {
  let userBlock
  return auth
    .signInWithEmailAndPassword(email, password)
    .then(user => {
      userBlock = {
        uid: user.user.uid,
      }
      cookies.save('uid', userBlock.uid, { maxAge: 31622400 })
      return users.doc(userBlock.uid).get()
    })
    .then(profile => ({ ...profile.data(), ...userBlock }))
}

export const userLogin = action$ =>
  action$.ofType(types.userLogin).switchMap(action =>
    login(action.payload)
      .then(user => userLoginSuccess(user))
      .catch(err => {
        debugger
        return userLoginError(err)
      })
  )

const loginFromToken = token =>
  users
    .doc(token)
    .get()
    .then(profile => ({ ...profile.data() }))

export const userLoginFromToken = action$ =>
  action$.ofType(types.userLoginFromToken).switchMap(action =>
    loginFromToken(action.payload)
      .then(user => userLoginSuccess(user))
      .catch(err => {
        debugger
        return userLoginError(err)
      })
  )

export const logout = action$ =>
  action$.ofType(types.logout).switchMap(action =>
    Promise.resolve().then(() => {
      cookies.remove('uid')
    })
  )
