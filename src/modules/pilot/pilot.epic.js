import '../../rxjs-operators'
import axios from 'axios'
import { types, fetchPilotDataSuccess } from './pilot.reducer'

const getPilot = callsign =>
  axios({
    method: 'get',
    url: 'https://us-central1-squadronhq-b1fdd.cloudfunctions.net/pilot',
    params: { callsign },
  }).then(item => {
    return item
  })

export const fetchPilotData = action$ =>
  action$.ofType(types.fetchPilotData).switchMap(action =>
    getPilot(action.payload).then(item => {
      return fetchPilotDataSuccess(item.data)
    })
  )
