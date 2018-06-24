import firebase from 'firebase/app'
import 'firebase/auth'

const config = {
  apiKey: 'AIzaSyCInHalJx95WGWPn9oDM4hTIudZHkKiuQI',
  authDomain: 'squadronhq-b1fdd.firebaseapp.com',
  databaseURL: 'https://squadronhq-b1fdd.firebaseio.com',
  projectId: 'squadronhq-b1fdd',
  storageBucket: 'squadronhq-b1fdd.appspot.com',
  messagingSenderId: '284812449480',
}

if (!firebase.apps.length) {
  firebase.initializeApp(config)
}

const auth = firebase.auth()

export { auth }
