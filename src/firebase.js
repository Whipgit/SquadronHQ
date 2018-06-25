import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import 'firebase/firestore'

firebase.initializeApp({
  apiKey: 'AIzaSyCInHalJx95WGWPn9oDM4hTIudZHkKiuQI',
  authDomain: 'squadronhq-b1fdd.firebaseapp.com',
  databaseURL: 'https://squadronhq-b1fdd.firebaseio.com',
  projectId: 'squadronhq-b1fdd',
  storageBucket: 'squadronhq-b1fdd.appspot.com',
  messagingSenderId: '284812449480',
})

const db = firebase.firestore()

export const auth = firebase.auth()
export const users = db.collection('users')
export const traps = db.collection('traps')
