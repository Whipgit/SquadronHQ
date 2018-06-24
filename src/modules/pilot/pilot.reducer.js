import { createAction, handleActions } from 'redux-actions'
import daggy from 'daggy'

const PilotData = daggy.taggedSum('PilotData', {
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
})

const LSO = daggy.taggedSum('LSO', {
  Empty: [],
  Check: [],
})

const rankSwitch = rank => {
  switch (rank) {
    case 'Ensign':
      return Rank.Ensign
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
    default:
      return Rank.Empty
  }
}

const lead = l => (l === 'Flight Leader' ? 'FL' : l === 'Section Leader' ? 'SL' : '')

const lso = lso => (lso ? LSO.Check : LSO.Empty)

export const types = {
  fetchPilotData: 'FETCH_PILOT_DATA',
  fetchPilotDataSuccess: 'FETCH_PILOT_DATA_SUCCESS',
}

export const fetchPilotData = createAction(types.fetchPilotData)
export const fetchPilotDataSuccess = createAction(types.fetchPilotDataSuccess)

export const INITIAL_STATE = {
  data: PilotData.Empty,
  pilot: {},
}

export default handleActions(
  {
    [types.fetchPilotData]: (state, { payload }) => {
      return {
        ...state,
        data: PilotData.Empty,
      }
    },
    [types.fetchPilotDataSuccess]: (state, { payload }) => {
      return {
        ...state,
        pilot: {
          ...payload,
          rankIcon: rankSwitch(payload.rank),
          leadStatus: lead(payload.lead),
          lsoIcon: lso(payload.lso),
        },
        data: PilotData.Data,
      }
    },
  },
  INITIAL_STATE
)
