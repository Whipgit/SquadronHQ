import '../../rxjs-operators'
import axios from 'axios'
import { types, fetchSquadronDataSuccess, fetchGreenieDataSuccess } from './squadron.reducer'

const getSquadron = squadronId =>
  axios({
    method: 'get',
    url: 'https://us-central1-squadronhq-b1fdd.cloudfunctions.net/squadron',
    params: { squadronId },
  }).then(item => {
    return item
  })

const getGreenie = squadronId =>
  axios({
    method: 'get',
    url: 'https://us-central1-squadronhq-b1fdd.cloudfunctions.net/greenie',
    params: { squadronId },
  }).then(item => {
    return item
  })

export const fetchSquadronData = action$ =>
  action$.ofType(types.fetchSquadronData).switchMap(action =>
    getSquadron(action.payload).then(item => {
      return fetchSquadronDataSuccess(item.data)
    })
  )

export const fetchGreenieData = action$ =>
  action$.ofType(types.fetchGreenieData).switchMap(action =>
    getGreenie(action.payload).then(item => {
      return fetchGreenieDataSuccess(item.data)
    })
  )

