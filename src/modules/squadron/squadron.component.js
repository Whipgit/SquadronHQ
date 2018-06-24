import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { compose, lifecycle } from 'recompose'
import { Header, Table, Icon, Flag, Card } from 'semantic-ui-react'
import { Dimmer, Loader } from 'semantic-ui-react'
import styled from 'styled-components'
import { Field, reduxForm } from 'redux-form'

import { fetchSquadronData } from './squadron.reducer'
import ens from '../../assets/US-O1_insignia.svg'
import ltjg from '../../assets/US-O2_insignia.svg'
import lt from '../../assets/US-O3_insignia.svg'
import lcdr from '../../assets/US-O4_insignia.svg'
import cdr from '../../assets/US-O5_insignia.svg'
import capt from '../../assets/US-O6_insignia.svg'
import { Helmet } from 'react-helmet'

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
      {squadron.activePilots.length} Pilots
    </Card.Content>
  </Card>
)

const Roster = ({ squadron, data }) => (
  <React.Fragment>
    <ImageContainer>
      {data.cata({
        Empty: () => <LoaderComponent name={squadron.squadronId} />,
        Data: () => (
          <RosterContainer>
            <RosterTable squadron={squadron} />
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
  })

const RosterTable = ({ squadron }) => (
  <React.Fragment>
    <Helmet>
      <meta charSet="utf-8" />
      <title>Squadron HQ - {squadron.squadronId}</title>
    </Helmet>

    <GridContainer>
      <SquadronDetails squadron={squadron} />
      <ImageWrapper>
        <SquadronLogo src={`http:${squadron.squadronLogo.file.url}`} />
      </ImageWrapper>
    </GridContainer>

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
              <Link to={`/pilot/${pilot.callsign}`}>{pilot.callsign}</Link>
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
                  <Link to={`/pilot/${pilot.callsign}`}>{pilot.callsign}</Link>
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
  text-align: right;
`

const SquadronLogo = styled.img`
  display: block;
  max-width: 200px;
  max-height: 177px;
  width: auto;
  height: auto;
  float: right;
`

const enhance = compose(
  lifecycle({
    componentDidMount() {
      if (this.props.curSquadron !== this.props.match.params.squadronId) {
        this.props.fetchSquadronData(this.props.match.params.squadronId)
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
  }),
  {
    fetchSquadronData,
  }
)(enhancedComponent)
