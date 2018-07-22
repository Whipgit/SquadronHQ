import React from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import { compose, lifecycle } from 'recompose'
import { Table, Icon, Divider, Statistic } from 'semantic-ui-react'
import { Dimmer, Loader } from 'semantic-ui-react'
import styled from 'styled-components'
import Auth from './Auth'

import { fetchPilotData } from './pilot.reducer'

import ens from '../../assets/US-O1_insignia.svg'
import ltjg from '../../assets/US-O2_insignia.svg'
import lt from '../../assets/US-O3_insignia.svg'
import lcdr from '../../assets/US-O4_insignia.svg'
import cdr from '../../assets/US-O5_insignia.svg'
import capt from '../../assets/US-O6_insignia.svg'

const getRank = str => (str.includes('USMC') ? str.replace('USMC - ', '') : str)

const Pilot = ({
  match: {
    params: { callsign },
  },
  pilot,
  data,
  authenticated,
  isFullMember,
  isTrainee,
}) => {
  return (
    <PilotContainer>
      <Helmet>
        <title>Squadron HQ - {callsign}</title>
      </Helmet>
      {data.cata({
        Empty: () => <LoaderComponent />,
        Data: () => (
          <InnerContainer>
            <H2>
              {isFullMember || isTrainee
                ? `${pilot.firstName} "${pilot.callsign}" ${pilot.familyName}`
                : pilot.callsign}
            </H2>
            <H4>{getRank(pilot.rank)}</H4>
            <Divider />

            <Statistic.Group widths="four">
              <Statistic>
                <Statistic.Value>35</Statistic.Value>
                <Statistic.Label>Traps</Statistic.Label>
              </Statistic>

              <Statistic>
                <Statistic.Value>4.5</Statistic.Value>
                <Statistic.Label>Average Grade</Statistic.Label>
              </Statistic>
              <Statistic>
                <Statistic.Value>9</Statistic.Value>
                <Statistic.Label>Sorties</Statistic.Label>
              </Statistic>
              <Statistic>
                <Statistic.Value>4</Statistic.Value>
                <Statistic.Label>Kills</Statistic.Label>
              </Statistic>
            </Statistic.Group>

            <Spacing />

            <Table celled>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell colSpan="4">D-CAT</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {pilot.training.d.map(item => (
                  <Table.Row>
                    <Table.Cell width={2} textAlign={'center'}>
                      {item.code}
                    </Table.Cell>
                    <Table.Cell width={4}>
                      {authenticated && (isTrainee || isFullMember) ? (
                        <Link to={`/training/${item.code}`}>{item.title}</Link>
                      ) : (
                        item.title
                      )}
                    </Table.Cell>
                    <Table.Cell width={9}>{item.shortDescription}</Table.Cell>
                    <Table.Cell width={1} textAlign={'center'}>
                      {item.earned ? <Icon name={'check'} color={'green'} /> : ''}
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
            <Table celled>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell colSpan="4">C-CAT</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {authenticated && isFullMember ? (
                  pilot.training.c.map(item => (
                    <Table.Row>
                      <Table.Cell width={2} textAlign={'center'}>
                        {item.code}
                      </Table.Cell>
                      <Table.Cell width={4}>
                        <Link to={`/training/${item.code}`}>{item.title}</Link>
                      </Table.Cell>
                      <Table.Cell width={9}>{item.shortDescription}</Table.Cell>
                      <Table.Cell width={1} textAlign={'center'}>
                        {item.earned ? <Icon name={'check'} color={'green'} /> : ''}
                      </Table.Cell>
                    </Table.Row>
                  ))
                ) : (
                  <Table.Row>
                    <Table.Cell width={2} textAlign={'left'}>
                      You must be a full member to view C-CAT material
                    </Table.Cell>
                  </Table.Row>
                )}
              </Table.Body>
            </Table>
            <Table celled>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell colSpan="4">B-CAT</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {authenticated && isFullMember ? (
                  pilot.training.b.map(item => (
                    <Table.Row>
                      <Table.Cell width={2} textAlign={'center'}>
                        {item.code}
                      </Table.Cell>
                      <Table.Cell width={4}>
                        <Link to={`/training/${item.code}`}>{item.title}</Link>
                      </Table.Cell>
                      <Table.Cell width={9}>{item.shortDescription}</Table.Cell>
                      <Table.Cell width={1} textAlign={'center'}>
                        {item.earned ? <Icon name={'check'} color={'green'} /> : ''}
                      </Table.Cell>
                    </Table.Row>
                  ))
                ) : (
                  <Table.Row>
                    <Table.Cell width={2} textAlign={'left'}>
                      You must be a full member to view B-CAT material
                    </Table.Cell>
                  </Table.Row>
                )}
              </Table.Body>
            </Table>
            <Table celled>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell colSpan="4">A-CAT</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {authenticated && isFullMember ? (
                  pilot.training.a.map(item => (
                    <Table.Row>
                      <Table.Cell width={2} textAlign={'center'}>
                        {item.code}
                      </Table.Cell>
                      <Table.Cell width={4}>
                        <Link to={`/training/${item.code}`}>{item.title}</Link>
                      </Table.Cell>
                      <Table.Cell width={9}>{item.shortDescription}</Table.Cell>
                      <Table.Cell width={1} textAlign={'center'}>
                        {item.earned ? <Icon name={'check'} color={'green'} /> : ''}
                      </Table.Cell>
                    </Table.Row>
                  ))
                ) : (
                  <Table.Row>
                    <Table.Cell width={2} textAlign={'left'}>
                      You must be a full member to view A-CAT material
                    </Table.Cell>
                  </Table.Row>
                )}
              </Table.Body>
            </Table>
          </InnerContainer>
        ),
      })}
    </PilotContainer>
  )
}

const H2 = styled.h2`
  padding: 0;
  margin: 0;
`

const H4 = styled.p`
  padding: 0;
  margin: 0;
`

const Spacing = styled.div`
  padding: 25px;
`

const PilotContainer = styled.div``

const InnerContainer = styled.div`
  width: 90%;
  margin: auto;
`

const enhance = compose(
  lifecycle({
    componentDidMount() {
      if (this.props.curPilot !== this.props.match.params.callsign) {
        this.props.fetchPilotData(this.props.match.params.callsign)
      }
    },
  })
)

const enhancedComponent = enhance(Pilot)

export default connect(
  state => ({
    data: state.pilot.data,
    pilot: state.pilot.pilot,
    curPilot: state.pilot.pilot.callsign,
    authenticated: state.user.authenticated,
    isTrainee: state.user.isTrainee,
    isFullMember: state.user.isFullMember,
  }),
  { fetchPilotData }
)(enhancedComponent)

const LoaderComponent = () => (
  <DimmerContainer>
    <Dimmer active inverted>
      <Loader>Loading Pilot</Loader>
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
