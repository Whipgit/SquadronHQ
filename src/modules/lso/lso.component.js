import React from 'react'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import { compose, lifecycle } from 'recompose'
import {
  Dimmer,
  Loader,
  Tab,
  Segment,
  Grid,
  Form,
  Search,
  Label,
  Dropdown,
  Button,
  Popup,
  Icon,
  Table,
} from 'semantic-ui-react'
import { Field, reduxForm } from 'redux-form'
import DatePicker from 'react-datepicker'
import * as moment from 'moment'
import styled from 'styled-components'

import 'react-datepicker/dist/react-datepicker.css'

import {
  fetchPilotsList,
  trimPilot,
  resetPilot,
  trimLso,
  resetLso,
  saveTrap,
  fetchLatestTraps,
  deleteTrap,
} from './lso.reducer'
import trapnote from '../../utils/trapnote'

const prestine = ({
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
  return !dateField || !pilotField || !lsoField || !airframeField || !gradeField
}
const RenderDatePicker = ({ input, placeholder, defaultValue, meta: { touched, error } }) => (
  <div>
    <DatePicker {...input} dateForm="MM/DD/YYYY" selected={input.value ? moment(input.value) : null} />
    {touched && error && <span>{error}</span>}
  </div>
)

const RenderDropdown = ({ input, placeholder, options, defaultValue, meta: { touched, error } }) => (
  <div>
    <Dropdown
      {...input}
      text={input.value}
      value={input.value}
      options={options}
      selection={true}
      onChange={(e, data) => {
        input.onChange(data.value)
      }}
      fluid={true}
    />
    {touched && error && <span>{error}</span>}
  </div>
)

const RenderSearchField = ({ input, results, trim, reset, defaultValue, meta: { touched, error } }) => (
  <div>
    <Search
      {...input}
      results={results}
      value={input.value}
      onSearchChange={(e, { value }) => {
        input.onChange(value)
        if (value.length < 1) return reset()
        return trim(value)
      }}
      onResultSelect={(e, data) => {
        return input.onChange(data.result.description)
      }}
      resultRenderer={({ title }) => <Label content={title} />}
    />
    {touched && error && <span>{error}</span>}
  </div>
)

const Users = ({ users, data }) => {
  return (
    <PilotContainer>
      <Helmet>
        <title>Squadron HQ - LSO Platform</title>
      </Helmet>
      {data.cata({
        Empty: () => <LoaderComponent />,
        Data: () => (
          <InnerContainer>
            <H1>LSO Platform</H1>
            <Segment>
              <LSOTabsConnected />
            </Segment>
          </InnerContainer>
        ),
      })}
    </PilotContainer>
  )
}

const panes = [
  {
    menuItem: 'Enter a Trap',
    render: () => (
      <Tab.Pane>
        <EnterTrapSheet />
      </Tab.Pane>
    ),
  },
  { menuItem: 'Remove a Trap', render: () => <LatestTrapsSheetConnected /> },
]

const LatestTrapsSheet = ({ removeTab, deleteTrap }) =>
  removeTab.cata({
    Loading: () => <Tab.Pane loading />,
    Data: data => (
      <Tab.Pane>
        <Table celled>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell width={2}>Trap Date</Table.HeaderCell>
              <Table.HeaderCell width={1}>Pilot</Table.HeaderCell>
              <Table.HeaderCell width={1}>LSO</Table.HeaderCell>
              <Table.HeaderCell width={3}>Notes</Table.HeaderCell>
              <Table.HeaderCell width={1}>Action</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {data.map(trap => (
              <Table.Row positive={trap.grade === 4} warning={trap.grade === 2.5} negative={trap.grade <= 2}>
                <Table.Cell>{moment(trap.trapDate).format('ddd, MMMM Do YYYY')}</Table.Cell>
                <Table.Cell>{trap.pilot}</Table.Cell>
                <Table.Cell>{trap.lso}</Table.Cell>
                <Table.Cell>{trapnote(trap)}</Table.Cell>
                <Table.Cell>
                  <Button onClick={() => deleteTrap(trap.id)}>x</Button>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </Tab.Pane>
    ),
  })

const LatestTrapsSheetConnected = connect(state => ({ removeTab: state.lso.removeTab }), { deleteTrap })(
  LatestTrapsSheet
)

const LSOTabs = ({ fetchLatestTraps }) => <Tab panes={panes} onTabChange={() => fetchLatestTraps()} />

const LSOTabsConnected = connect(state => ({}), {
  fetchLatestTraps,
})(LSOTabs)

const EnterTrap = ({
  reset,
  pilot,
  trimPilot,
  resetPilot,
  lso,
  trimLso,
  resetLso,
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
  spinner,
  saveTrap,
}) => {
  return (
    <React.Fragment>
      <Form onSubmit={() => {}}>
        <Grid divided={'vertically'}>
          <Grid.Row>
            <Grid.Column width={3}>
              <div>
                <label>Trap Date</label>
                <div>
                  <StyledField component={RenderDatePicker} name="date" required />
                </div>
              </div>
            </Grid.Column>
            <Grid.Column width={4}>
              <div>
                <label>Pilot</label>
                <div>
                  <StyledField
                    component={RenderSearchField}
                    name="pilot"
                    required
                    results={pilot}
                    trim={trimPilot}
                    reset={resetPilot}
                  />
                </div>
              </div>
            </Grid.Column>
            <Grid.Column width={4}>
              <div>
                <label>LSO</label>
                <div>
                  <StyledField
                    component={RenderSearchField}
                    name="lso"
                    required
                    results={lso}
                    trim={trimLso}
                    reset={resetLso}
                  />
                </div>
              </div>
            </Grid.Column>
            <Grid.Column width={3}>
              <div>
                <label>Airframe</label>
                <div>
                  <StyledField
                    component={RenderDropdown}
                    name="airframe"
                    required
                    options={[{ text: 'F/A-18C', value: 'F/A-18C' }, { text: 'F-14B', value: 'F-14B' }]}
                    selection
                  />
                </div>
              </div>
            </Grid.Column>
            <Grid.Column width={2}>
              <div>
                <label style={{ paddingRight: '5px' }}>Grade</label>
                <div>
                  <StyledField
                    component={RenderDropdown}
                    name="grade"
                    required
                    options={[
                      { text: '0 CUT', value: 0 },
                      { text: '1 WO', value: 1 },
                      { text: '2 NG', value: 2 },
                      { text: '2.5 BLTR', value: 2.5 },
                      { text: '3 FAIR', value: 3 },
                      { text: '4 OK', value: 4 },
                      { text: '5 OK', value: 5 },
                    ]}
                    selection
                  />
                </div>
              </div>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <LsoTitle>Glidescope & Speed Errors</LsoTitle>
            <Grid.Column width={3}>
              <div>
                <label>AW</label>
                <Popup
                  trigger={<Iconer name={'question circle'} />}
                  content={
                    'AW- All the Way - used for constant deviation through entire glideslope. AFU- All Fouled Up - multiple deviations too numerous to write down within form constraints.'
                  }
                />
                <div>
                  <StyledField
                    component={RenderDropdown}
                    name="glideAW"
                    required
                    options={aw}
                    selection
                    scrolling
                    floating
                  />
                </div>
              </div>
            </Grid.Column>
            <Grid.Column width={3}>
              <div>
                <label>X</label>
                <Popup
                  trigger={<Iconer name={'question circle'} />}
                  content={'X - At the start - The first 1/3 of the glideslope'}
                />
                <div>
                  <StyledField component={RenderDropdown} name="glideX" required options={x} selection scrolling />
                </div>
              </div>
            </Grid.Column>
            <Grid.Column width={3}>
              <div>
                <label>IM</label>
                <Popup
                  trigger={<Iconer name={'question circle'} />}
                  content={'IM - In the Middle - The second 2/3 of the glideslope'}
                />
                <div>
                  <StyledField component={RenderDropdown} name="glideIM" required options={im} selection scrolling />
                </div>
              </div>
            </Grid.Column>
            <Grid.Column width={3}>
              <div>
                <label>IC</label>
                <Popup
                  trigger={<Iconer name={'question circle'} />}
                  content={'IC - In Close - The last 3/3 of the glideslope'}
                />
                <div>
                  <StyledField component={RenderDropdown} name="glideIC" required options={ic} selection scrolling />
                </div>
              </div>
            </Grid.Column>
            <Grid.Column width={3}>
              <div>
                <label>AR</label>
                <Popup trigger={<Iconer name={'question circle'} />} content={'AR - At the Ramp'} />
                <div>
                  <StyledField component={RenderDropdown} name="glideAR" required options={ar} selection scrolling />
                </div>
              </div>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <LsoTitle>
              At Ramp - To Landing
              <Popup trigger={<Iconer name={'question circle'} />} content={'State in which the aircraft landed'} />
              <Small>* Optional with 2 LSO on duty one with a clear view not in PLAT view</Small>
            </LsoTitle>
            <Grid.Column width={8}>
              <div>
                <label>Deviation</label>
                <div>
                  <StyledField
                    component={RenderDropdown}
                    name="lineDeviationA"
                    required
                    options={deviationOptions}
                    selection
                    scrolling
                  />
                </div>
              </div>
            </Grid.Column>
            <Grid.Column width={8}>
              <div>
                <label>Deviation</label>
                <div>
                  <StyledField
                    component={RenderDropdown}
                    name="lineDeviationB"
                    required
                    options={deviationOptions}
                    selection
                    scrolling
                  />
                </div>
              </div>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={5}>
              <div>
                <label>Wires</label>
                <div>
                  <StyledField component={RenderDropdown} name="wires" required options={wires} selection scrolling />
                </div>
              </div>
            </Grid.Column>
            <Grid.Column width={11}>
              <div>
                <label>LSO Remarks</label>
                <div>
                  <StyledField component={'input'} name="remarks" />
                </div>
              </div>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row width={12}>
            <Grid.Column>
              <Button
                loading={spinner}
                fluid
                size="large"
                type={'submit'}
                disabled={prestine({
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
                })}
                onClick={() =>
                  saveTrap({
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
                    reset,
                  })
                }
              >
                SUBMIT TRAP
              </Button>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Form>
    </React.Fragment>
  )
}

const EnterTrapConnected = connect(
  state => ({
    spinner: state.lso.spinner,
    pilot: state.lso.pilot,
    lso: state.lso.lso,
    dateField: state.form.lso && state.form.lso.values && state.form.lso.values.date,
    pilotField: state.form.lso && state.form.lso.values && state.form.lso.values.pilot,
    lsoField: state.form.lso && state.form.lso.values && state.form.lso.values.lso,
    airframeField: state.form.lso && state.form.lso.values && state.form.lso.values.airframe,
    gradeField: state.form.lso && state.form.lso.values && state.form.lso.values.grade,
    awField: state.form.lso && state.form.lso.values && state.form.lso.values.glideAW,
    xField: state.form.lso && state.form.lso.values && state.form.lso.values.glideX,
    imField: state.form.lso && state.form.lso.values && state.form.lso.values.glideIM,
    icField: state.form.lso && state.form.lso.values && state.form.lso.values.glideIC,
    lineDeviationAField: state.form.lso && state.form.lso.values && state.form.lso.values.lineDeviationA,
    lineDeviationBField: state.form.lso && state.form.lso.values && state.form.lso.values.lineDeviationB,
    wiresField: state.form.lso && state.form.lso.values && state.form.lso.values.wiresField,
  }),
  {
    trimPilot,
    resetPilot,
    trimLso,
    resetLso,
    saveTrap,
  }
)(EnterTrap)

const EnterTrapSheet = reduxForm({
  // a unique name for the form
  form: 'lso',
})(EnterTrapConnected)

const StyledField = styled(Field)``

const PilotContainer = styled.div``

const InnerContainer = styled.div`
  width: 90%;
  margin: auto;
`

const H1 = styled.h1``

const enhance = compose(
  lifecycle({
    componentDidMount() {
      this.props.fetchPilotsList()
    },
  })
)
const Small = styled.div`
  font-size: 8px;
  margin-top: -5px;
`

const enhancedComponent = enhance(Users)

export default connect(state => ({ data: state.lso.data, pilot: state.lso.pilot }), {
  fetchPilotsList,
})(enhancedComponent)

const LoaderComponent = () => (
  <DimmerContainer>
    <Dimmer active inverted>
      <Loader>Loading LSO Platform</Loader>
    </Dimmer>
  </DimmerContainer>
)

const DimmerContainer = styled.div`
  position: fixed; /* Sit on top of the page content */
  width: 100vw; /* Full width (cover the whole page) */
  height: 100vh; /* Full height (cover the whole page) */
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-order; 2;
`
const LsoTitle = styled.p`
  position: absolute;
  text-transform: uppercase;
  padding-left: 13px;
  top: 3px;
  font-weight: bold;
`
const Iconer = styled(Icon)`
  margin-left: 3px !important;
`

const aw = [
  { text: 'On Glideslope On Centerline', value: 'OGOC' },
  { text: 'All Fouled Up', value: 'AFU' },
  { text: 'Fast', value: 'F' },
  { text: '(Fast)', value: '(F)' },
  { text: 'Slow', value: 'SLO' },
  { text: '(Slow)', value: '(SLO)' },
  { text: 'High', value: 'H' },
  { text: '(High)', value: '(H)' },
  { text: 'Low', value: 'LO' },
  { text: '(Low)', value: '(LO)' },
  { text: 'Lined Up Left', value: 'LUL' },
  { text: '(Lined Up Left)', value: '(LUL)' },
  { text: 'Lined Up Right', value: 'LUR' },
  { text: '(Lined Up Right)', value: '(LUR)' },
  { text: 'No Hook', value: 'NH' },
  { text: 'Pitching Deck, special indication only when authorized in briefing', value: 'PD' },
  { text: 'Rough, constant up/down on the glideslope', value: 'RUF' },
  { text: 'Long In Groove - Waveoff', value: 'LIG' },
]

const x = [
  { text: 'On Glideslope On Centerline', value: 'OGOC' },
  { text: 'Fast', value: 'F' },
  { text: '(Fast)', value: '(F)' },
  { text: 'Slow', value: 'SLO' },
  { text: '(Slow)', value: '(SLO)' },
  { text: 'High', value: 'H' },
  { text: '(High)', value: '(H)' },
  { text: 'Low', value: 'LO' },
  { text: '(Low)', value: '(LO)' },
  { text: 'Lined Up Left', value: 'LUL' },
  { text: '(Lined Up Left)', value: '(LUL)' },
  { text: 'Lined Up Right', value: 'LUR' },
  { text: '(Lined Up Right)', value: '(LUR)' },
  { text: 'Drifted Left', value: 'DL' },
  { text: '(Drifted Left)', value: '(DL)' },
  { text: 'Drifted Right', value: 'DR' },
  { text: '(Drifted Right)', value: '(DR)' },
  { text: 'Overshoot lineup (once)', value: 'OS' },
  { text: 'Overshoot lineup (++1)', value: 'OSCB' },
  { text: 'Too Much Power', value: 'TMP' },
  { text: '(Too Much Power)', value: '(TMP)' },
  { text: 'Not Enough Power', value: 'NEP' },
  { text: '(Not Enough Power)', value: '(NEP)' },
  { text: 'Rolled in too close to the boat, closer than ¾ mile', value: 'NESA' },
  { text: 'Not Enough Rate of Descent', value: 'NERD' },
  { text: 'Pulled Nose Up', value: 'PNU' },
  { text: '(Pulled Nose Up)', value: '(PNU)' },
  { text: 'Dropped Nose', value: 'DN' },
  { text: '(Dropped Nose)', value: '(DN)' },
  { text: 'Pilot Waved Off', value: 'OWO' },
  { text: 'LSO Waved Off', value: 'WO' },
]

const im = [
  { text: 'On Glideslope On Centerline', value: 'OGOC' },
  { text: 'Late Lineup', value: 'LLU' },
  { text: '(Late Lineup)', value: '(LLU)' },
  { text: 'Fast', value: 'F' },
  { text: '(Fast)', value: '(F)' },
  { text: 'Slow', value: 'SLO' },
  { text: '(Slow)', value: '(SLO)' },
  { text: 'High', value: 'H' },
  { text: '(High)', value: '(H)' },
  { text: 'Low', value: 'LO' },
  { text: '(Low)', value: '(LO)' },
  { text: 'Lined Up Left', value: 'LUL' },
  { text: '(Lined Up Left)', value: '(LUL)' },
  { text: 'Lined Up Right', value: 'LUR' },
  { text: '(Lined Up Right)', value: '(LUR)' },
  { text: 'Drifted Left', value: 'DL' },
  { text: '(Drifted Left)', value: '(DL)' },
  { text: 'Drifted Right', value: 'DR' },
  { text: '(Drifted Right)', value: '(DR)' },
  { text: 'Overshoot lineup (once)', value: 'OS' },
  { text: 'Overshoot lineup (++1)', value: 'OSCB' },
  { text: 'Too Much Power', value: 'TMP' },
  { text: '(Too Much Power)', value: '(TMP)' },
  { text: 'Not Enough Power', value: 'NEP' },
  { text: '(Not Enough Power)', value: '(NEP)' },
  { text: 'Rolled in too close to the boat, closer than ¾ mile', value: 'NESA' },
  { text: 'Not Enough Rate of Descent', value: 'NERD' },
  { text: 'Pulled Nose Up', value: 'PNU' },
  { text: '(Pulled Nose Up)', value: '(PNU)' },
  { text: 'Dropped Nose', value: 'DN' },
  { text: '(Dropped Nose)', value: '(DN)' },
  { text: 'Pilot Waved Off', value: 'OWO' },
  { text: 'LSO Waved Off', value: 'WO' },
]

const ic = [
  { text: 'On Glideslope On Centerline', value: 'OGOC' },
  { text: 'Fast', value: 'F' },
  { text: '(Fast)', value: '(F)' },
  { text: 'Slow', value: 'SLO' },
  { text: '(Slow)', value: '(SLO)' },
  { text: 'High', value: 'H' },
  { text: '(High)', value: '(H)' },
  { text: 'Low', value: 'LO' },
  { text: '(Low)', value: '(LO)' },
  { text: 'Lined Up Left', value: 'LUL' },
  { text: '(Lined Up Left)', value: '(LUL)' },
  { text: 'Lined Up Right', value: 'LUR' },
  { text: '(Lined Up Right)', value: '(LUR)' },
  { text: 'Drifted Left', value: 'DL' },
  { text: '(Drifted Left)', value: '(DL)' },
  { text: 'Drifted Right', value: 'DR' },
  { text: '(Drifted Right)', value: '(DR)' },
  { text: 'Overshoot lineup (once)', value: 'OS' },
  { text: 'Overshoot lineup (++1)', value: 'OSCB' },
  { text: 'Too Much Power', value: 'TMP' },
  { text: '(Too Much Power)', value: '(TMP)' },
  { text: 'Not Enough Power', value: 'NEP' },
  { text: '(Not Enough Power)', value: '(NEP)' },
  { text: 'Not Enough Rate of Descent', value: 'NERD' },
  { text: 'Pulled Nose Up', value: 'PNU' },
  { text: '(Pulled Nose Up)', value: '(PNU)' },
  { text: 'Dropped Nose', value: 'DN' },
  { text: '(Dropped Nose)', value: '(DN)' },
  { text: 'Pilot Waved Off', value: 'OWO' },
  { text: 'LSO Waved Off', value: 'WO' },
]

const ar = [
  { text: 'On Glideslope On Centerline', value: 'OGOC' },
  { text: 'Fast', value: 'F' },
  { text: '(Fast)', value: '(F)' },
  { text: 'Slow', value: 'SLO' },
  { text: '(Slow)', value: '(SLO)' },
  { text: 'High', value: 'H' },
  { text: '(High)', value: '(H)' },
  { text: 'Low', value: 'LO' },
  { text: '(Low)', value: '(LO)' },
  { text: 'Lined Up Left', value: 'LUL' },
  { text: '(Lined Up Left)', value: '(LUL)' },
  { text: 'Lined Up Right', value: 'LUR' },
  { text: '(Lined Up Right)', value: '(LUR)' },
  { text: 'Drifted Left', value: 'DL' },
  { text: '(Drifted Left)', value: '(DL)' },
  { text: 'Drifted Right', value: 'DR' },
  { text: '(Drifted Right)', value: '(DR)' },
  { text: 'Pulled Nose Up', value: 'PNU' },
  { text: '(Pulled Nose Up)', value: '(PNU)' },
  { text: 'Dropped Nose', value: 'DN' },
  { text: '(Dropped Nose)', value: '(DN)' },
  { text: 'Settled', value: 'S' },
  { text: '(Settled)', value: '(S)' },
  { text: 'Pilot Waved Off', value: 'OWO' },
  { text: 'LSO Waved Off', value: 'WO' },
]

const deviationOptions = [
  { text: 'On Glideslope On Centerline', value: 'OGOC' },
  { text: 'Pulled Nose Up', value: 'PNU' },
  { text: '(Pulled Nose Up)', value: '(PNU)' },
  { text: 'Dropped Nose', value: 'DN' },
  { text: '(Dropped Nose)', value: '(DN)' },
  { text: 'Landed Left', value: 'LL' },
  { text: '(Landed Left)', value: '(LL)' },
  { text: 'Landed Right', value: 'LR' },
  { text: '(Landed Right)', value: '(LR)' },
  { text: 'Landed Left Wing Down', value: 'LLWD' },
  { text: 'Landed Right Wing Down', value: 'LRWD' },
  { text: 'Landed Nose (severe nose drop)', value: 'LNF' },
  { text: 'Landed on all 3 landing gear at once', value: '3PTS' },
  { text: 'Spotted Deck (Did nit look at the ball all the way to wheels down)', value: 'SD' },
]

const locationOptions = [{ text: 'AR', value: 'AR' }, { text: 'AW', value: 'AW' }]

const wires = [
  { text: '1 Wire', value: '1 Wire' },
  { text: '2 Wire', value: '2 Wire' },
  { text: '3 Wire', value: '3 Wire' },
  { text: '4 Wire', value: '4 Wire' },
  { text: 'Bolter', value: 'Bolter' },
]
