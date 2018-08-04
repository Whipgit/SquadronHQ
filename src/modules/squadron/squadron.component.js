import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { compose, lifecycle } from 'recompose'
import { Header, Table, Icon, Flag, Card, Menu, Grid, Statistic } from 'semantic-ui-react'
import { Dimmer, Loader, Popup } from 'semantic-ui-react'
import styled from 'styled-components'
import { Field, reduxForm } from 'redux-form'

import { fetchSquadronData, selectTab, fetchGreenieData } from './squadron.reducer'
import ens from '../../assets/US-O1_insignia.svg'
import ltjg from '../../assets/US-O2_insignia.svg'
import lt from '../../assets/US-O3_insignia.svg'
import lcdr from '../../assets/US-O4_insignia.svg'
import cdr from '../../assets/US-O5_insignia.svg'
import capt from '../../assets/US-O6_insignia.svg'
import { Helmet } from 'react-helmet'
import * as moment from 'moment'

const LoaderComponent = () => (
  <DimmerContainer>
    <Dimmer active inverted>
      <Loader>Loading Squadron</Loader>
    </Dimmer>
  </DimmerContainer>
)

let SquadronSelector = ({ handleSubmit }) => {
  return (
    <form onSubmit={() => handleSubmit()}>
      <Field name={'Squadron Sele'} component="select">
        <option value="#ff0000">Red</option>
        <option value="#00ff00">Green</option>
        <option value="#0000ff">Blue</option>
      </Field>
    </form>
  )
}

SquadronSelector = reduxForm({
  // a unique name for the form
  form: 'squadron',
})(SquadronSelector)

const SquadronDetails = ({ squadron }) => (
  <Card>
    <Card.Content header={`${squadron.squadronId} ${squadron.nickname}`} />
    <Card.Content>
      <div>
        <b>Branch:</b> {squadron.branch}
      </div>
      <div>
        <b>Callsign:</b> {squadron.callsign}
      </div>
    </Card.Content>
    <Card.Content extra>
      <Icon name={'user'} />
      {squadron.activePilots.length}/14 Pilots
    </Card.Content>
  </Card>
)

const Roster = ({ squadron, data, isFullMember, isTrainee, tabSelected, selectTab, greenieData }) => (
  <React.Fragment>
    <ImageContainer>
      {data.cata({
        Empty: () => <LoaderComponent name={squadron.squadronId} />,
        Data: () => (
          <RosterContainer>
            <RosterTable
              squadron={squadron}
              isFullMember={isFullMember}
              isTrainee={isTrainee}
              tabSelected={tabSelected}
              selectTab={selectTab}
              greenieData={greenieData}
            />
          </RosterContainer>
        ),
      })}
    </ImageContainer>
  </React.Fragment>
)

const RankSvg = ({ rank }) =>
  rank.cata({
    Empty: () => {
      return null
    },
    ENS: () => <RankImage src={ens} />,
    LTJG: () => <RankImage src={ltjg} />,
    LT: () => <RankImage src={lt} />,
    LCDR: () => <RankImage src={lcdr} />,
    CDR: () => <RankImage src={cdr} />,
    CAPT: () => <RankImage src={capt} />,
    MENS: () => <RankImage src={ens} />,
    MLTJG: () => <RankImage src={ltjg} />,
    MLT: () => <RankImage src={lt} />,
    MLCDR: () => <RankImage src={lcdr} />,
    MCDR: () => <RankImage src={cdr} />,
    MCAPT: () => <RankImage src={capt} />,
  })

const RosterTable = ({ squadron, isFullMember, isTrainee, selectTab, tabSelected, greenieData }) => (
  <React.Fragment>
    <Helmet>
      <meta charSet="utf-8" />
      <title>Squadron HQ - {squadron.squadronId}</title>
    </Helmet>
    <Grid>
      <Grid.Column width={4} verticalAlign={'bottom'}>
        <SquadronDetails squadron={squadron} />
      </Grid.Column>
      <Grid.Column width={8} verticalAlign={'bottom'}>
        <Grid.Row textAlign={'centered'}>
          <Statistic>
            <Statistic.Value>...</Statistic.Value>
            <Statistic.Label>Average Grade</Statistic.Label>
          </Statistic>
          <Statistic>
            <Statistic.Value>...</Statistic.Value>
            <Statistic.Label>Sorties</Statistic.Label>
          </Statistic>
        </Grid.Row>
        <Grid.Row>
          <Menu compact>
            <Menu.Item as={'a'} name="roster" active={tabSelected === 'roster'} onClick={() => selectTab('roster')}>
              Roster
            </Menu.Item>

            <Menu.Item
              as={'a'}
              name="greenieBoard"
              active={tabSelected === 'greenie'}
              onClick={() => selectTab('greenie')}
            >
              Greenie Board
            </Menu.Item>

            <Menu.Item as={'a'} name="about" active={false}>
              About
            </Menu.Item>
            <Menu.Item as={'a'} name="sop" active={false}>
              S.O.P.
            </Menu.Item>
          </Menu>
        </Grid.Row>
      </Grid.Column>
      <Grid.Column width={4} verticalAlign={'centered'}>
        <ImageWrapper>
          <SquadronLogo src={`http:${squadron.squadronLogo.file.url}`} />
        </ImageWrapper>
      </Grid.Column>
    </Grid>
    {tabSelected === 'roster' ? (
      <React.Fragment>
        <Table celled>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell width={1} textAlign={'center'}>
                Modex
              </Table.HeaderCell>
              <Table.HeaderCell width={1} textAlign={'center'}>
                Rank
              </Table.HeaderCell>
              <Table.HeaderCell width={1} textAlign={'center'}>
                Country
              </Table.HeaderCell>
              <Table.HeaderCell width={5}>Name</Table.HeaderCell>
              <Table.HeaderCell width={1} textAlign={'center'}>
                Qualification
              </Table.HeaderCell>
              <Table.HeaderCell width={1} textAlign={'center'}>
                FL/SL
              </Table.HeaderCell>
              <Table.HeaderCell width={1} textAlign={'center'}>
                LSO
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          {squadron.activePilots.map((pilot, key) => (
            <Table.Body key={key}>
              <Table.Row>
                <Table.Cell>
                  <Header textAlign={'center'}>{pilot.modex}</Header>
                </Table.Cell>
                <Table.Cell textAlign={'center'}>
                  <RankSvg rank={pilot.rankIcon} />
                </Table.Cell>
                <Table.Cell textAlign={'center'}>
                  <Flag name={pilot.countryCode} />
                </Table.Cell>
                <Table.Cell>
                  <Link to={`/pilot/${pilot.callsign}`}>
                    {isFullMember || isTrainee
                      ? `${pilot.firstName} "${pilot.callsign}" ${pilot.familyName}`
                      : pilot.callsign}
                  </Link>
                  {pilot.specialRole === 'C.O.' ? (
                    <SubRank>
                      <br />Commanding Officer
                    </SubRank>
                  ) : (
                    ''
                  )}
                  {pilot.specialRole === 'X.O.' ? (
                    <SubRank>
                      <br />Executive Officer
                    </SubRank>
                  ) : (
                    ''
                  )}
                </Table.Cell>
                <Table.Cell textAlign={'center'}>{pilot.qualificationLevel}</Table.Cell>
                <Table.Cell textAlign={'center'}>{pilot.leadStatus}</Table.Cell>
                <Table.Cell textAlign={'center'}>
                  {pilot.lsoIcon.cata({
                    Check: () => <Icon name={'check'} />,
                    Empty: () => {},
                  })}
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          ))}
        </Table>

        {squadron.inactivePilots.length ? (
          <React.Fragment>
            <h2>Inactive Pilots</h2>
            <Table celled>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell width={1} textAlign={'center'}>
                    Modex
                  </Table.HeaderCell>
                  <Table.HeaderCell width={1} textAlign={'center'}>
                    Rank
                  </Table.HeaderCell>
                  <Table.HeaderCell width={1} textAlign={'center'}>
                    Country
                  </Table.HeaderCell>
                  <Table.HeaderCell width={5}>Name</Table.HeaderCell>
                  <Table.HeaderCell width={1} textAlign={'center'}>
                    Qualification
                  </Table.HeaderCell>
                  <Table.HeaderCell width={3} textAlign={'center'}>
                    Service
                  </Table.HeaderCell>
                </Table.Row>
              </Table.Header>

              {squadron.inactivePilots.map((pilot, key) => (
                <Table.Body key={key}>
                  <Table.Row>
                    <Table.Cell>
                      <Header textAlign={'center'}>{pilot.modex}</Header>
                    </Table.Cell>
                    <Table.Cell textAlign={'center'}>
                      <RankSvg rank={pilot.rankIcon} />
                    </Table.Cell>
                    <Table.Cell textAlign={'center'}>
                      <Flag name={pilot.countryCode} />
                    </Table.Cell>
                    <Table.Cell>
                      <Link to={`/pilot/${pilot.callsign}`}>
                        {isFullMember ? `${pilot.firstName} "${pilot.callsign}" ${pilot.familyName}` : pilot.callsign}
                      </Link>
                    </Table.Cell>
                    <Table.Cell textAlign={'center'}>{pilot.qualificationLevel}</Table.Cell>
                    <Table.Cell textAlign={'center'}>
                      {pilot.squadronAssignmentDate} - {pilot.endOfService}
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
              ))}
            </Table>
          </React.Fragment>
        ) : (
          ''
        )}
      </React.Fragment>
    ) : (
      ''
    )}

    {tabSelected === 'greenie' ? (
      <React.Fragment>
        <Table celled>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell textAlign={'left'}>Callsign</Table.HeaderCell>
              <Table.HeaderCell textAlign={'center'}>Average</Table.HeaderCell>
              <Table.HeaderCell textAlign={'left'} colSpan={'20'}>
                Traps
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          {greenieData.map((pilot, key) => (
            <Table.Body key={key}>
              <Table.Row>
                <Table.Cell textAlign={'left'}>{pilot.callsign}</Table.Cell>
                <Table.Cell textAlign={'center'}>{pilot.average}</Table.Cell>
                {pilot.traps.map(trap => (
                  <Popup
                    trigger={
                      <Table.Cell
                        positive={trap.grade === 4}
                        warning={trap.grade === 2.5}
                        negative={trap.grade <= 2 && trap.grade !== ''}
                        textAlign={'center'}
                      >
                        {trap.grade}
                      </Table.Cell>
                    }
                    content={`${moment(trap.trapDate).format('dddd, MMMM Do YYYY')} - ${trap.lsoNotes}`}
                    basic
                  />
                ))}
              </Table.Row>
            </Table.Body>
          ))}
        </Table>
      </React.Fragment>
    ) : (
      ''
    )}
  </React.Fragment>
)

const ImageContainer = styled.div``

const RosterContainer = styled.div`
  width: 90%;
  margin: auto;
`

const RankImage = styled.img`
  height: 25px;
`

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

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-column-gap: 20px;
  grid-row-gap: 20px;
  justify-items: stretch;
  align-items: stretch;
`

const ImageWrapper = styled.div`
  width: 100%:
`

const SubRank = styled.p`
  font-size: 10px;
  margin: 0 !important;
  padding: 0 !important;
  margin-top: -15px !important;
`

const SquadronLogo = styled.img`
  width: 80%;
`

const enhance = compose(
  lifecycle({
    componentDidMount() {
      if (this.props.curSquadron !== this.props.match.params.squadronId) {
        this.props.fetchSquadronData(this.props.match.params.squadronId)
        this.props.fetchGreenieData(this.props.match.params.squadronId)
      }
    },
    componentWillReceiveProps(nextProps) {
      if (this.props.curSquadron !== nextProps.match.params.squadronId) {
        this.props.fetchSquadronData(nextProps.match.params.squadronId)
        this.props.fetchGreenieData(nextProps.match.params.squadronId)
      }
    },
  })
)

const enhancedComponent = enhance(Roster)

export default connect(
  state => ({
    data: state.squadron.data,
    squadron: state.squadron.squadron,
    curSquadron: state.squadron.squadron.squadronId,
    authenticated: state.user.authenticated,
    isFullMember: state.user.isFullMember,
    isTrainee: state.user.isTrainee,
    tabSelected: state.squadron.tabSelected,
    greenieData: state.squadron.greenieData,
  }),
  {
    fetchSquadronData,
    selectTab,
    fetchGreenieData,
  }
)(enhancedComponent)
