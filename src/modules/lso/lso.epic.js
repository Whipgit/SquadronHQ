import '../../rxjs-operators'
import { types, fetchPilotsListSuccess, trapSaved, renderLatestTraps } from './lso.reducer'
import * as moment from 'moment'
import { traps } from '../../firebase.js'
import axios from 'axios/index'

const getPilotsList = () =>
  axios({
    method: 'get',
    url: 'https://us-central1-squadronhq-b1fdd.cloudfunctions.net/pilotList',
  }).then(item => {
    return item
  })

const saveTrapToDB = ({
  dateField,
  pilotField,
  lsoField,
  airframeField,
  gradeField,
  awField,
  xField,
  imField,
  icField,
  lineDeviationAField,
  lineDeviationBField,
  wiresField,
}) => {
  return traps.add({
    date: moment(dateField, 'MM/DD/YYYY').toDate(),
    pilot: pilotField,
    lso: lsoField,
    airframe: airframeField,
    grade: gradeField,
    aw: awField || 'ACOG',
    x: xField || 'ACOG',
    im: imField || 'ACOG',
    ic: icField || 'ACOG',
    lineDeviationA: lineDeviationAField || 'ACOG',
    lineDeviationB: lineDeviationBField || 'ACOG',
    wires: wiresField || '',
  })
}

const fetchLatestTrapsFromDB = () => {
  return traps
    .orderBy('date', 'desc')
    .limit(50)
    .get()
    .then(traps => {
      const trapsArray = []
      traps.forEach(trap => {
        let data = trap.data()
        data.trapDate = data.date.toDate()
        data.id = trap.id
        trapsArray.push(data)
      })
      return trapsArray
    })
}

const deleteTrapFromDB = id => {
  return traps.doc(id).delete()
}

export const fetchPilotsList = action$ =>
  action$
    .ofType(types.fetchPilotsList)
    .switchMap(action => getPilotsList(action.payload).then(users => fetchPilotsListSuccess(users.data)))

export const saveTrap = action$ =>
  action$.ofType(types.saveTrap).switchMap(({ payload }) => {
    payload.reset()
    return saveTrapToDB(payload).then(res => trapSaved())
  })

export const fetchLatestTraps = action$ =>
  action$.ofType(types.fetchLatestTraps).switchMap(({ payload }) => {
    return fetchLatestTrapsFromDB().then(res => renderLatestTraps(res))
  })

export const deleteTrap = action$ =>
  action$.ofType(types.deleteTrap).switchMap(({ payload }) => {
    return deleteTrapFromDB(payload).then(res => ({
      type: 'TRAP DELETED',
      payload,
    }))
  })
