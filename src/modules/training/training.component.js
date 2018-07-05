import React from 'react'
import { connect } from 'react-redux'
import { compose, lifecycle } from 'recompose'
import { Segment, Card, Tab } from 'semantic-ui-react'
import { Dimmer, Loader } from 'semantic-ui-react'
import styled from 'styled-components'
import moment from 'moment'
import { fetchTrainingData } from './training.reducer'
import showdown from 'showdown'
import 'showdown-youtube'
const converter = new showdown.Converter({ extensions: ['youtube'] })

const LoaderComponent = () => (
  <DimmerContainer>
    <Dimmer active inverted>
      <Loader>Loading Training</Loader>
    </Dimmer>
  </DimmerContainer>
)

const Training = ({ training, data }) => (
  <React.Fragment>
    <ImageContainer>
      {data.cata({
        Empty: () => <LoaderComponent />,
        Data: () => (
          <RosterContainer>
            <TrainingContent training={training} />
          </RosterContainer>
        ),
      })}
    </ImageContainer>
  </React.Fragment>
)

const TrainingContent = ({ training }) => (
  <React.Fragment>
    <Card>
      <Card.Content>
        <Card.Header>{training.fields.title}</Card.Header>
        <Card.Meta>
          {training.fields.code} - {training.fields.category}
        </Card.Meta>
        <Card.Description>{training.fields.shortDescription}</Card.Description>
        <Card.Meta>Last updated: {moment(training.sys.updatedAt).format('DD/MM/YYYY')}</Card.Meta>
      </Card.Content>
    </Card>
    <Segment>
      <TrainingSections />
    </Segment>
  </React.Fragment>
)

const panes = [
  {
    menuItem: 'Acceptance Criteria',
    render: () => (
      <Tab.Pane>
        <Acceptance />
      </Tab.Pane>
    ),
  },
  {
    menuItem: 'Training Material',
    render: () => (
      <Tab.Pane>
        <Curriculum />
      </Tab.Pane>
    ),
  },
]

const TrainingSections = () => <Tab panes={panes} />

const Acceptance = connect(
  state => ({
    trainingGuidelines:
      (state.training.training.fields && state.training.training.fields.trainingGuidelines) ||
      'No acceptance criteria available',
  }),
  {}
)(({ trainingGuidelines }) => <div dangerouslySetInnerHTML={{ __html: converter.makeHtml(trainingGuidelines) }} />)

const Curriculum = connect(
  state => ({
    curriculum:
      (state.training.training.fields && state.training.training.fields.curriculum) || 'No training material available',
  }),
  {}
)(({ curriculum }) => <div dangerouslySetInnerHTML={{ __html: converter.makeHtml(curriculum) }} />)

const TrainingTitle = styled.h1`
  padding: 0;
  margin: 0;
`
const TrainingSubtitle = styled.p`
  padding: 0;
  margin: 0;
`

const ImageContainer = styled.div``

const RosterContainer = styled.div`
  width: 90%;
  margin: auto;
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

const enhance = compose(
  lifecycle({
    componentDidMount() {
      if (this.props.curTraining !== this.props.match.params.code) {
        this.props.fetchTrainingData(this.props.match.params.code)
      }
    },
    componentWillReceiveProps(nextProps) {
      if (this.props.curTraining !== nextProps.match.params.code) {
        this.props.fetchTrainingData(nextProps.match.params.code)
      }
    },
  })
)

const enhancedComponent = enhance(Training)

export default connect(
  state => ({
    data: state.training.data,
    training: state.training.training,
    curTraining: state.training.training.fields && state.training.training.fields.code,
  }),
  {
    fetchTrainingData,
  }
)(enhancedComponent)
