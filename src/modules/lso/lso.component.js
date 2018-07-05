import React from 'react'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import { compose, lifecycle } from 'recompose'
import { Dimmer, Loader, Tab, Segment, Grid, Form, Search, Label, Dropdown, Button } from 'semantic-ui-react'
import { Field, reduxForm } from 'redux-form'
import DatePicker from 'react-datepicker'
import moment from 'moment'
import styled from 'styled-components'

import 'react-datepicker/dist/react-datepicker.css'

import { fetchPilotsList, trimPilot, resetPilot, trimLso, resetLso } from './lso.reducer'

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
      fluid
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
              <LSOTabs />
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
  { menuItem: 'Remove a Trap', render: () => <Tab.Pane>Tab 2 Content</Tab.Pane> },
]

const LSOTabs = () => <Tab panes={panes} />

const EnterTrap = ({ pilot, trimPilot, resetPilot, lso, trimLso, resetLso }) => {
  return (
    <React.Fragment>
      <Form onSubmit={() => {}}>
        <Grid divided={'vertically'}>
          <Grid.Row>
            <Grid.Column width={3}>
              <div>
                <label>Trap Date</label>
                <div>
                  <StyledField component={RenderDatePicker} name="trapDate" required />
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
                <label>Grade</label>
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
            <Grid.Column width={4}>
              <div>
                <label>AW</label>
                <div>
                  <StyledField
                    component={RenderDropdown}
                    name="glideAW"
                    required
                    options={speedOptions}
                    selection
                    scrolling
                  />
                </div>
              </div>
            </Grid.Column>
            <Grid.Column width={4}>
              <div>
                <label>OT</label>
                <div>
                  <StyledField
                    component={RenderDropdown}
                    name="glideOT"
                    required
                    options={speedOptions}
                    selection
                    scrolling
                  />
                </div>
              </div>
            </Grid.Column>
            <Grid.Column width={4}>
              <div>
                <label>X</label>
                <div>
                  <StyledField
                    component={RenderDropdown}
                    name="glideX"
                    required
                    options={speedOptions}
                    selection
                    scrolling
                  />
                </div>
              </div>
            </Grid.Column>
            <Grid.Column width={4}>
              <div>
                <label>IM</label>
                <div>
                  <StyledField
                    component={RenderDropdown}
                    name="glideIM"
                    required
                    options={speedOptions}
                    selection
                    scrolling
                  />
                </div>
              </div>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <LsoTitle>Control Errors</LsoTitle>
            <Grid.Column width={8}>
              <div>
                <label>Power</label>
                <div>
                  <StyledField
                    component={RenderDropdown}
                    name="controlPower"
                    required
                    options={controlOptions}
                    selection
                    scrolling
                  />
                </div>
              </div>
            </Grid.Column>
            <Grid.Column width={8}>
              <div>
                <label>Attitude</label>
                <div>
                  <StyledField
                    component={RenderDropdown}
                    name="controlAttitude"
                    required
                    options={attitudeOptions}
                    selection
                    scrolling
                  />
                </div>
              </div>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <LsoTitle>Lineup & Landing</LsoTitle>
            <Grid.Column width={5}>
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
            <Grid.Column width={5}>
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
            <Grid.Column width={6}>
              <div>
                <label>Location</label>
                <div>
                  <StyledField
                    component={RenderDropdown}
                    name="lineLocation"
                    required
                    options={locationOptions}
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
              <Button fluid size="large" type={'submit'}>
                SUBMIT TRAP
              </Button>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Form>
    </React.Fragment>
  )
}

const EnterTrapConnected = connect(state => ({ pilot: state.lso.pilot, lso: state.lso.lso }), {
  trimPilot,
  resetPilot,
  trimLso,
  resetLso,
})(EnterTrap)

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

const speedOptions = [
  { text: 'AFU', value: 'AFU' },
  { text: 'B', value: 'B' },
  { text: 'DR', value: 'DR' },
  { text: 'F', value: 'F' },
  { text: 'FD', value: 'FD' },
  { text: 'H', value: 'H' },
  { text: 'LIG', value: 'LIG' },
  { text: 'NEP', value: 'NEP' },
  { text: 'NERD', value: 'NERD' },
  { text: 'NESA', value: 'NESA' },
  { text: 'NSU', value: 'NH' },
  { text: 'P', value: 'P' },
  { text: 'S', value: 'S' },
  { text: 'SD', value: 'SD' },
  { text: 'SLO', value: 'SLO' },
  { text: 'ST', value: 'ST' },
  { text: 'TCA', value: 'TCA' },
  { text: 'TMP', value: 'TMP' },
  { text: 'TMRD', value: 'TMRD' },
  { text: 'TTL', value: 'TTL' },
  { text: 'TWA', value: 'TWA' },
]

const controlOptions = [
  { text: 'ACC', value: 'ACC' },
  { text: 'B', value: 'B' },
  { text: 'GLI', value: 'GLI' },
  { text: 'H', value: 'H' },
  { text: 'LO', value: 'LO' },
  { text: 'NEP', value: 'NEP' },
  { text: 'S', value: 'S' },
  { text: 'SRD', value: 'SRD' },
  { text: 'TMP', value: 'TMP' },
]

const attitudeOptions = [
  { text: 'ND', value: 'ND' },
  { text: 'NEA', value: 'NEA' },
  { text: 'OR', value: 'OR' },
  { text: 'PNU', value: 'PNU' },
  { text: 'SKD', value: 'SKD' },
  { text: 'ST', value: 'ST' },
  { text: 'XCTL', value: 'XCTL' },
]

const deviationOptions = [
  { text: 'AA', value: 'AA' },
  { text: 'DL', value: 'DL' },
  { text: 'LLU', value: 'LLU' },
  { text: 'FD', value: 'FD' },
  { text: 'LL', value: 'LL' },
  { text: 'LR', value: 'LR' },
  { text: 'LUL', value: 'LUL' },
  { text: 'LUR', value: 'LUR' },
  { text: 'LWD', value: 'LWD' },
  { text: 'NH', value: 'NH' },
  { text: 'PNU', value: 'PNU' },
  { text: 'RWD', value: 'RWD' },
  { text: 'S', value: 'S' },
  { text: 'TMRD', value: 'TMRD' },
  { text: 'LLWD', value: 'LLWD' },
  { text: 'LRWD', value: 'LRDW' },
  { text: 'LNF', value: 'LNF' },
  { text: '3PTS', value: '3PTS' },
]

const locationOptions = [
  { text: 'X', value: 'X' },
  { text: 'IM', value: 'IM' },
  { text: 'IC', value: 'IC' },
  { text: 'AR', value: 'AR' },
  { text: 'AW', value: 'AW' },
]

const wires = [
  { text: '1 Wire', value: '1 Wire' },
  { text: '2 Wire', value: '2 Wire' },
  { text: '3 Wire', value: '3 Wire' },
  { text: '4 Wire', value: '4 Wire' },
  { text: 'Bolter', value: 'Bolter' },
]
