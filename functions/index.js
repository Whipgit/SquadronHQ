const dotenv = require('dotenv').config()
const functions = require('firebase-functions')
const contentful = require('contentful')
const { sort } = require('ramda')
const trapnote = require('./utils/trapnote')
const firebase = require('firebase/app')
require('firebase/auth')
require('firebase/firestore')

const diff = (a, b) => a.modex - b.modex
const diffTraining = (a, b) => a.index - b.index
const client = contentful.createClient({
  space: process.env.SPACE_ID,
  accessToken: process.env.ACCESS_TOKEN,
})

const getAverage = arr => {
  const filtered = arr.filter(item => item.grade !== '')
  const average = Math.round(
    arr.filter(item => item.grade !== '').reduce((a, b) => {
      if (b.grade !== '') {
        const grade = b.grade * 100
        return a + grade
      } else {
        return a
      }
    }, 0) /
    100 /
    filtered.length *
    100
  ) / 100
  return isNaN(average) ? 'N/A' : average
}

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
const traps = db.collection('traps')
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
        title: `${item.fields.modex} - ${item.fields.firstName} - ${item.fields.callsign} - ${item.fields.familyName}`,
        description: item.fields.callsign,
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

exports.greenie = functions.https.onRequest((req, res) => {
  res.set('Access-Control-Allow-Origin', req.get('Origin'))
  res.set('Access-Control-Allow-Credentials', true)
  res.set('Access-Control-Allow-Methods', 'GET')
  const greenieLength = req.query.length || 20
  return client
    .getEntries({ content_type: 'squadrons', 'fields.squadronId': req.query.squadronId })
    .then(response => {
      const pilotsArray = response.items[0].fields.pilots.map(({ fields }) => fields.callsign)
      return Promise.all(
        pilotsArray.map(pilot =>
          traps
            .where('pilot', '==', pilot)
            .orderBy('date', 'asc')
            .limit(20)
            .get()
            .then(traps => {
              const trapsArray = []
              traps.forEach(trap => {
                const data = trap.data()
                trapsArray.push({
                  grade: data.grade,
                  trapDate: data.date,
                  lsoNotes: trapnote(data),
                })
              })
              const length = trapsArray.length
              if (length < greenieLength) {
                for (let i = length; i < greenieLength; i++) {
                  trapsArray.push({ grade: '' })
                }
              }
              return { callsign: pilot, traps: trapsArray, average: getAverage(trapsArray) }
            })
        )
      )
    })
    .then(response => res.send(response))
    .catch(err => res.send(err))
})

exports.pilot = functions.https.onRequest((req, res) => {
  res.set('Access-Control-Allow-Origin', req.get('Origin'))
  res.set('Access-Control-Allow-Credentials', true)
  res.set('Access-Control-Allow-Methods', 'GET')
  let pilot = {}
  let pilotId
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
      pilotId = (response && response.items && response.items[0] && response.items[0].sys.id) || 'error'
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
      pilot.id = pilotId
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

exports.training = functions.https.onRequest((req, res) => {
  res.set('Access-Control-Allow-Origin', req.get('Origin'))
  res.set('Access-Control-Allow-Credentials', true)
  res.set('Access-Control-Allow-Methods', 'GET')
  client
    .getEntries({ content_type: 'trainingEvents', 'fields.code': req.query.code || 'FAM-2101' })
    .then(response => res.send(response.items[0]))
})

const greenieLength = 20
client
  .getEntries({ content_type: 'squadrons', 'fields.squadronId': 'VF-213' })
  .then(response => {
    const pilotsArray = response.items[0].fields.pilots.map(({ fields }) => fields.callsign)
    return Promise.all(
      pilotsArray.map(pilot =>
        traps
          .where('pilot', '==', pilot)
          .orderBy('date', 'asc')
          .limit(20)
          .get()
          .then(traps => {
            const trapsArray = []
            traps.forEach(trap => {
              const data = trap.data()
              trapsArray.push({
                grade: data.grade,
                trapDate: data.date,
                lsoNotes: trapnote(data),
              })
            })
            const length = trapsArray.length
            if (length < greenieLength) {
              for (let i = length; i < greenieLength; i++) {
                trapsArray.push({ grade: '' })
              }
            }
            return { callsign: pilot, traps: trapsArray, average: getAverage(trapsArray) }
          })
      )
    )
  })
  .then(response => {
    debugger
  })
