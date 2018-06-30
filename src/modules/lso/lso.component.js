import React from 'react'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import { compose, lifecycle } from 'recompose'
import { Dimmer, Loader, Tab, Segment, Grid, Form } from 'semantic-ui-react'
import { Field, reduxForm } from 'redux-form'
import DatePicker from 'react-datepicker'
import moment from 'moment'
import styled from 'styled-components'
import Auth from './Auth'

import 'react-datepicker/dist/react-datepicker.css'

import { fetchUsersData, saveUserPermissions } from './lso.reducer'

const RenderDatePicker = ({ input, placeholder, defaultValue, meta: { touched, error } }) => (
  <div>
    <DatePicker {...input} dateForm="MM/DD/YYYY" selected={input.value ? moment(input.value) : null} />
    {touched && error && <span>{error}</span>}
  </div>
)

const Users = ({ users, data, saveUserPermissions }) => {
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

const EnterTrap = () => (
  <React.Fragment>
    <Form onSubmit={() => {}}>
      <Grid>
        <Grid.Column width={4}>
          <div>
            <label>Trap Date</label>
            <div>
              <StyledField component={RenderDatePicker} name="trapDate" required />
            </div>
          </div>
        </Grid.Column>
        <Grid.Column width={4}>Placeholder</Grid.Column>
        <Grid.Column width={4}>Placeholder</Grid.Column>
      </Grid>
    </Form>
  </React.Fragment>
)

const EnterTrapSheet = reduxForm({
  // a unique name for the form
  form: 'lso',
})(EnterTrap)

const StyledField = styled(Field)`
  margin-top: 5px !important;
  margin-bottom: 10px !important;
`

const PilotContainer = styled.div``

const InnerContainer = styled.div`
  width: 90%;
  margin: auto;
`

const H1 = styled.h1``

const enhance = compose(
  lifecycle({
    componentDidMount() {
      this.props.fetchUsersData()
    },
  })
)

const enhancedComponent = enhance(Users)

export default connect(state => ({ data: state.users.data, users: state.users.users }), {
  fetchUsersData,
  saveUserPermissions,
})(enhancedComponent)

const LoaderComponent = () => (
  <DimmerContainer>
    <Dimmer active inverted>
      <Loader>Loading Traps</Loader>
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
