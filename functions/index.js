const dotenv = require('dotenv').config()
const functions = require('firebase-functions')
const contentful = require('contentful')
const { sort } = require('ramda')

const diff = (a, b) => a.modex - b.modex
const diffTraining = (a, b) => a.index - b.index
const client = contentful.createClient({
  space: process.env.SPACE_ID,
  accessToken: process.env.ACCESS_TOKEN,
})

exports.roster = functions.https.onRequest((req, res) => {
  res.set('Access-Control-Allow-Origin', req.get('Origin'))
  res.set('Access-Control-Allow-Credentials', true)
  res.set('Access-Control-Allow-Methods', 'GET')
  return client
    .getEntries({ content_type: 'squadrons', 'sys.id': req.query.squadronId || '7BQm2qhEism2GQiwWUCMga' })
    .then(response =>
      res.send(
        response.items.map(({ fields, sys }) => ({
          id: sys.id,
          squadronId: fields.squadronId,
          callsign: fields.callsign,
          nickname: fields.nickname,
          branch: fields.branch,
          squadronLogo: fields.squadronLogo.fields,
          airframes: fields.airframes,
          activePilots: sort(
            diff,
            fields.pilots
              .map(({ fields, sys }) => {
                delete fields.training
                fields.id = sys.id
                return fields
              })
              .filter(pilot => pilot.active)
          ),
          inactivePilots: sort(
            diff,
            fields.pilots
              .map(({ fields, sys }) => {
                delete fields.training
                fields.id = sys.id
                return fields
              })
              .filter(pilot => !pilot.active)
          ),
        }))[0]
      )
    )
})

exports.squadron = functions.https.onRequest((req, res) => {
  res.set('Access-Control-Allow-Origin', req.get('Origin'))
  res.set('Access-Control-Allow-Credentials', true)
  res.set('Access-Control-Allow-Methods', 'GET')
  return client.getEntries({ content_type: 'squadrons', 'fields.squadronId': req.query.squadronId }).then(response =>
    res.send(
      response.items.map(({ fields, sys }) => ({
        id: sys.id,
        squadronId: fields.squadronId,
        callsign: fields.callsign,
        nickname: fields.nickname,
        branch: fields.branch,
        squadronLogo: fields.squadronLogo.fields,
        airframes: fields.airframes,
        activePilots: sort(
          diff,
          fields.pilots
            .map(({ fields, sys }) => {
              delete fields.training
              fields.id = sys.id
              return fields
            })
            .filter(pilot => pilot.active)
        ),
        inactivePilots: sort(
          diff,
          fields.pilots
            .map(({ fields, sys }) => {
              delete fields.training
              fields.id = sys.id
              return fields
            })
            .filter(pilot => !pilot.active)
        ),
      }))[0]
    )
  )
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