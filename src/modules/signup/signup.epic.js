import '../../rxjs-operators'
import { types, userSignupSuccess, userSignupError } from './signup.reducer'
import { userLoginSuccess } from '../login/login.reducer'
import cookies from 'react-cookies'
import { auth, users } from '../../firebase.js'

const login = ({ email, password, callsign }) => {
  let userBlock
  return auth
    .createUserWithEmailAndPassword(email, password)
    .then(user => {
      userBlock = {
        email,
        callsign,
        isLSO: false,
        isAdmin: false,
        isStaff: false,
        isFullMember: false,
        isTrainee: false,
        uid: user.user.uid,
      }
      cookies.save('uid', userBlock.uid, { maxAge: 31622400 })
      return users.doc(userBlock.uid).set(userBlock)
    })
    .then(() => userBlock)
}

export const userSignup = action$ =>
  action$.ofType(types.userSignup).switchMap(action =>
    login(action.payload)
      .then(user => {
        userSignupSuccess()
        return userLoginSuccess(user)
      })
      .catch(err => userSignupError(err))
  )
