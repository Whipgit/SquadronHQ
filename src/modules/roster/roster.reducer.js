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
  fetchRosterData: 'FETCH_ROSTER_DATA',
  fetchRosterDataSuccess: 'FETCH_ROSTER_DATA_SUCCESS',
}

export const fetchRosterData = createAction(types.fetchRosterData)
export const fetchRosterDataSuccess = createAction(types.fetchRosterDataSuccess)

export const INITIAL_STATE = {
  data: RosterData.Empty,
  squadron: {},
}

export default handleActions(
  {
    [types.fetchRosterDataSuccess]: (state, { payload }) => {
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
