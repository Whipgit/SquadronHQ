import '../rxjs-operators'
import axios from 'axios'
import { types, fetchLayoutDataSuccess } from './main.redux'

const getLayout = () =>
  axios({
    method: 'get',
    url: 'https://us-central1-squadronhq-b1fdd.cloudfunctions.net/airwing',
  }).then(item => {
    return item
  })

export const fetchLayoutData = action$ =>
  action$.ofType(types.fetchLayoutData).switchMap(action =>
    getLayout(action.payload).then(item => {
      return fetchLayoutDataSuccess(item.data)
    })
  )
