import { combineEpics } from 'redux-observable'
import { fetchSquadronData } from '../modules/squadron/squadron.epic'
import { fetchPilotData } from '../modules/pilot/pilot.epic'
import { fetchLayoutData } from '../layouts/main.epic'

export default combineEpics(fetchSquadronData, fetchPilotData, fetchLayoutData)
