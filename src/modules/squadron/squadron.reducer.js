import { createAction, handleActions } from 'redux-actions'
import daggy from 'daggy'

const RosterData = daggy.taggedSum('RosterData', {
  Empty: [],
  Data: [],
  Error: ['error'],
})

const Rank = daggy.taggedSum('Rank', {
  Empty: [],
  ENS: [],
  LTJG: [],
  LT: [],
  LCDR: [],
  CDR: [],
  CAPT: [],
  MENS: [],
  MLTJG: [],
  MLT: [],
  MLCDR: [],
  MCDR: [],
  MCAPT: [],
})

const LSO = daggy.taggedSum('LSO', {
  Empty: [],
  Check: [],
})

const rankSwitch = rank => {
  switch (rank) {
    case 'Ensign':
      return Rank.ENS
    case 'Lieutenant Junior Grade':
      return Rank.LTJG
    case 'Lieutenant':
      return Rank.LT
    case 'Lieutenant Commander':
      return Rank.LCDR
    case 'Commander':
      return Rank.CDR
    case 'Captain':
      return Rank.CAPT
    case 'USMC - Second Lieutenant':
      return Rank.MENS
    case 'USMC - First Lieutenant':
      return Rank.MLTJG
    case 'USMC - Captain':
      return Rank.MLT
    case 'USMC - Major':
      return Rank.MLCDR
    case 'USMC - Lieutenant Colonel':
      return Rank.MCDR
    case 'USMC - Colonel':
      return Rank.MCAPT
    default:
      return Rank.Empty
  }
}

const lead = l => (l === 'Flight Leader' ? 'FL' : l === 'Section Leader' ? 'SL' : '')

const lso = lso => (lso ? LSO.Check : LSO.Empty)

export const types = {
  fetchSquadronData: 'FETCH_SQUADRON_DATA',
  fetchSquadronDataSuccess: 'FETCH_SQUADRON_DATA_SUCCESS',
}

export const fetchSquadronData = createAction(types.fetchSquadronData)
export const fetchSquadronDataSuccess = createAction(types.fetchSquadronDataSuccess)

export const INITIAL_STATE = {
  data: RosterData.Empty,
  squadron: {},
}

export default handleActions(
  {
    [types.fetchSquadronData]: (state, { payload }) => {
      return {
        ...state,
        data: RosterData.Empty,
      }
    },
    [types.fetchSquadronDataSuccess]: (state, { payload }) => {
      return {
        ...state,
        data: RosterData.Data,
        squadron: {
          ...payload,
          activePilots: payload.activePilots.map(pilot => ({
            ...pilot,
            rankIcon: rankSwitch(pilot.rank),
            leadStatus: lead(pilot.lead),
            lsoIcon: lso(pilot.lso),
          })),
          inactivePilots: payload.inactivePilots.map(pilot => ({
            ...pilot,
            rankIcon: rankSwitch(pilot.rank),
            leadStatus: lead(pilot.lead),
            lsoIcon: lso(pilot.lso),
          })),
        },
      }
    },
  },
  INITIAL_STATE
)
