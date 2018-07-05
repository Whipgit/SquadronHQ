import '../../rxjs-operators'
import axios from 'axios'
import { types, fetchTrainingDataSuccess } from './training.reducer'

const getTraining = code =>
  axios({
    method: 'get',
    url: 'https://us-central1-squadronhq-b1fdd.cloudfunctions.net/training',
    params: { code },
  }).then(item => {
    return item
  })

export const fetchTrainingData = action$ =>
  action$.ofType(types.fetchTrainingData).switchMap(action =>
    getTraining(action.payload).then(item => {
      return fetchTrainingDataSuccess(item.data)
    })
  )
