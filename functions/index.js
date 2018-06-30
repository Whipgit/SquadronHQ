const dotenv = require('dotenv').config()
const functions = require('firebase-functions')
const contentful = require('contentful')
const { sort } = require('ramda')
const firebase = require('firebase/app')
require('firebase/auth')
require('firebase/firestore')

const diff = (a, b) => a.modex - b.modex
const diffTraining = (a, b) => a.index - b.index
const client = contentful.createClient({
  space: process.env.SPACE_ID,
  accessToken: process.env.ACCESS_TOKEN,
})

const roundHundred = value => Math.round(value / 100) * 100

firebase.initializeApp({
  apiKey: 'AIzaSyCInHalJx95WGWPn9oDM4hTIudZHkKiuQI',
  authDomain: 'squadronhq-b1fdd.firebaseapp.com',
  databaseURL: 'https://squadronhq-b1fdd.firebaseio.com',
  projectId: 'squadronhq-b1fdd',
  storageBucket: 'squadronhq-b1fdd.appspot.com',
  messagingSenderId: '284812449480',
})

const db = firebase.firestore()
const users = db.collection('users')
const auth = firebase.auth()

exports.login = functions.https.onRequest((req, res) => {
  res.set('Access-Control-Allow-Origin', req.get('Origin'))
  res.set('Access-Control-Allow-Credentials', true)
  res.set('Access-Control-Allow-Methods', 'GET')
  let userBlock
  auth
    .signInWithEmailAndPassword(req.query.email || '', req.query.password || '')
    .then(user => users.doc(user.user.uid).get())
    .then(profile => profile.data())
    .then(result => {
      delete result.uid
      res.send(result)
    })
    .catch(err => res.send(err))
})

exports.pilotList = functions.https.onRequest((req, res) => {
  res.set('Access-Control-Allow-Origin', req.get('Origin'))
  res.set('Access-Control-Allow-Credentials', true)
  res.set('Access-Control-Allow-Methods', 'GET')
  return client.getEntries({ content_type: 'pilots', 'fields.active': true }).then(allPilots =>
    res.send(
      allPilots.items.map(item => ({
        search: `${item.fields.modex} - ${item.fields.firstName} - ${item.fields.callsign} - ${item.fields.familyName}`,
        callsign: item.fields.callsign,
        modex: item.fields.modex,
        id: item.sys.id,
      }))
    )
  )
})

exports.squadron = functions.https.onRequest((req, res) => {
  res.set('Access-Control-Allow-Origin', req.get('Origin'))
  res.set('Access-Control-Allow-Credentials', true)
  res.set('Access-Control-Allow-Methods', 'GET')
  return client.getEntries({ content_type: 'squadrons', 'fields.squadronId': req.query.squadronId }).then(response => {
    return res.send(
      response.items.map(({ fields, sys }) => {
        let returnObject = {
          id: sys.id,
          squadronId: fields.squadronId,
          callsign: fields.callsign,
          nickname: fields.nickname,
          branch: fields.branch,
          squadronLogo: fields.squadronLogo.fields,
          airframes: fields.airframes,
        }
        returnObject.activePilots =
          fields.pilots && fields.pilots.length
            ? sort(
                diff,
                fields.pilots
                  .map(({ fields, sys }) => {
                    delete fields.training
                    delete fields.staffComments
                    fields.id = sys.id
                    return fields
                  })
                  .filter(pilot => pilot.active)
              )
            : []
        returnObject.inactivePilots =
          fields.pilots && fields.pilots.length
            ? sort(
                diff,
                fields.pilots
                  .map(({ fields, sys }) => {
                    delete fields.training
                    delete fields.staffComments
                    fields.id = sys.id
                    return fields
                  })
                  .filter(pilot => !pilot.active)
              )
            : []
        return returnObject
      })[0]
    )
  })
})

exports.pilot = functions.https.onRequest((req, res) => {
  res.set('Access-Control-Allow-Origin', req.get('Origin'))
  res.set('Access-Control-Allow-Credentials', true)
  res.set('Access-Control-Allow-Methods', 'GET')
  let pilot = {}
  let trainingEvents = {
    a: [],
    b: [],
    c: [],
    d: [],
  }
  client
    .getEntries({ content_type: 'pilots', 'fields.callsign': req.query.callsign })
    .then(response => {
      pilot = (response && response.items && response.items[0] && response.items[0].fields) || 'error'
      return client.getEntries({ content_type: 'trainingEvents' })
    })
    .then(allTraining => {
      allTraining.items
        .map(event => {
          if (pilot.training && pilot.training.filter(item => item.fields.code === event.fields.code).length > 0) {
            event.fields.earned = true
          } else {
            event.fields.earned = false
          }
          delete event.fields.trainingGuidelines
          return event
        })
        .map(event => {
          if (event.fields.category === 'A-CAT') trainingEvents.a.push(event.fields)
          if (event.fields.category === 'B-CAT') trainingEvents.b.push(event.fields)
          if (event.fields.category === 'C-CAT') trainingEvents.c.push(event.fields)
          if (event.fields.category === 'D-CAT') trainingEvents.d.push(event.fields)
        })
      trainingEvents.a = sort(diffTraining, trainingEvents.a)
      trainingEvents.b = sort(diffTraining, trainingEvents.b)
      trainingEvents.c = sort(diffTraining, trainingEvents.c)
      trainingEvents.d = sort(diffTraining, trainingEvents.d)
      delete pilot.training
      pilot.training = trainingEvents
      res.send(pilot)
    })
})

exports.airwing = functions.https.onRequest((req, res) => {
  res.set('Access-Control-Allow-Origin', req.get('Origin'))
  res.set('Access-Control-Allow-Credentials', true)
  res.set('Access-Control-Allow-Methods', 'GET')
  client.getEntries({ content_type: 'organization', 'fields.shortName': 'CVW-11' }).then(response => {
    let data = response.items[0].fields
    data.squadrons = sort((a, b) => a.fields.index - b.fields.index, data.squadrons)
    data.squadrons.map(item => {
      delete item.sys
      return item.fields
    })
    res.send(data)
  })
})
