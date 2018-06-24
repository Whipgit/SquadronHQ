import '../../rxjs-operators'
import axios from 'axios'
import { types, fetchRosterDataSuccess } from './roster.reducer'

const getRoster = squadronId =>
  axios({
    method: 'get',
    url: 'https://us-central1-squadronhq-b1fdd.cloudfunctions.net/roster',
    params: { squadronId },
  }).then(item => {
    return item
  })

export const fetchRosterData = action$ =>
  action$.ofType(types.fetchRosterData).switchMap(action =>
    getRoster(action.payload).then(item => {
      return fetchRosterDataSuccess(item.data)
    })
  )
