import React, { Component } from 'react'
import { Route, Link } from 'react-router-dom'
import {
  Container,
  Divider,
  Dropdown,
  Grid,
  Header,
  Image,
  List,
  Menu,
  Segment,
  Dimmer,
  Loader,
} from 'semantic-ui-react'
import styled from 'styled-components'
import { fetchLayoutData } from './main.redux'
import { userLoginFromToken, logout } from '../modules/login/login.reducer'
import { connect } from 'react-redux'
import { compose, lifecycle } from 'recompose'
import cookies from 'react-cookies'

import bck1 from '../assets/bck1.jpg'
import bck2 from '../assets/bck2.jpg'
import bck3 from '../assets/bck4.jpg'
import bck4 from '../assets/bck4.jpg'

import cvwLogo from '../assets/cvw11_5.png'

const randomImage = () => {
  const n = Math.floor(Math.random() * Math.floor(4))
  if (n === 0) return bck1
  if (n === 1) return bck2
  if (n === 2) return bck3
  if (n === 3) return bck4
}

const LoaderComponent = () => (
  <DimmerContainer>
    <Dimmer active inverted>
      <Loader>Loading Squadron HQ</Loader>
    </Dimmer>
  </DimmerContainer>
)

const MainLayout = ({
  children,
  layout,
  authenticated,
  callsign,
  isFullMember,
  isLSO,
  isTrainee,
  isAdmin,
  isStaff,
  logout,
  ...rest
}) => {
  return (
    <React.Fragment>
      <Background>
        <StyledMenu fixed="top" inverted stackable>
          <Container>
            <Link to={``}>
              <Menu.Item header>
                <Image size="mini" src={cvwLogo} /> CVW-11
              </Menu.Item>
            </Link>
            <Menu.Item href={'http://vcvw-11.freeforums.net/'}>Forum</Menu.Item>
            {layout.squadrons.map((squadron, key) => {
              return (
                <Menu.Item key={key}>
                  <Link to={`/squadron/${squadron.fields.squadronId}`}>{squadron.fields.squadronId}</Link>
                </Menu.Item>
              )
            })}
            <Dropdown item simple text="Air Wing Resources">
              <Dropdown.Menu>
                <Dropdown.Item>List Item</Dropdown.Item>
                <Dropdown.Item>List Item</Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Header>Header Item</Dropdown.Header>
                <Dropdown.Item>
                  <i className="dropdown icon" />
                  <span className="text">Submenu</span>
                  <Dropdown.Menu>
                    <Dropdown.Item>List Item</Dropdown.Item>
                    <Dropdown.Item>List Item</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown.Item>
                <Dropdown.Item>List Item</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            {authenticated ? (
              <Menu.Item position={'right'}>
                <Dropdown text={callsign}>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() => logout()}>Logout</Dropdown.Item>
                    {isFullMember || isAdmin || isTrainee || isStaff ? <Dropdown.Item>Files / Mods</Dropdown.Item> : ''}
                    {isAdmin || isStaff || isLSO ? (
                      <React.Fragment>
                        <Dropdown.Divider />
                        <Dropdown.Header>Admin Section</Dropdown.Header>
                        <Dropdown.Item>LSO Deck</Dropdown.Item>
                        {isAdmin ? <Dropdown.Item>Manage Users</Dropdown.Item> : ''}
                      </React.Fragment>
                    ) : (
                      ''
                    )}
                  </Dropdown.Menu>
                </Dropdown>
              </Menu.Item>
            ) : (
              <Menu.Item position={'right'}>
                <Link to={`/login`}>Login</Link>
              </Menu.Item>
            )}
          </Container>
        </StyledMenu>

        <Container>
          <ChildContainer>{children}</ChildContainer>
        </Container>

        <FooterContainer>
          <StyledSegment vertical>
            <Container textAlign="center">
              <Image centered size="small" src={cvwLogo} />
              <List horizontal inverted divided link>
                <List.Item as="a" href="#">
                  Site Map
                </List.Item>
                <List.Item as="a" href="#">
                  Contact Us
                </List.Item>
                <List.Item as="a" href="#">
                  Terms and Conditions
                </List.Item>
                <List.Item as="a" href="#">
                  Privacy Policy
                </List.Item>
              </List>
            </Container>
          </StyledSegment>
        </FooterContainer>
      </Background>
    </React.Fragment>
  )
}

const Background = styled.div`
  background-image: url(${randomImage()});
  background-size: cover;
  background-color: #293949 !important;
`

const FooterContainer = styled.div`
  position: relative;
  margin: 0 auto;
  width: 100%;
  bottom: 0;
`

const StyledSegment = styled(Segment)`
  background-color: #293949 !important;
`

const enhance = compose(
  lifecycle({
    componentDidMount() {
      const uid = cookies.load('uid')
      if (uid) {
        this.props.userLoginFromToken(uid)
      }
      if (this.props.layout.shortName !== 'CVW-11') {
        this.props.fetchLayoutData()
      }
    },
  })
)

const StyledMenu = styled(Menu)`
  background-color: #293949 !important;
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

const ChildContainer = styled.div`
  opacity: 0.95;
  padding-bottom: 200px;
  padding-top: 130px;
  min-height: 768px;
`

const MainLayoutWrapper = ({ data, layout, ...rest }) => {
  return (
    <div>
      {data.cata({
        Empty: () => <LoaderComponent />,
        Data: () => <MainLayout layout={layout} {...rest} />,
      })}
    </div>
  )
}

const enhancedComponent = enhance(MainLayoutWrapper)

const Connected = connect(
  state => ({
    layout: state.layout.layout,
    data: state.layout.data,
    authenticated: state.user.authenticated,
    callsign: state.user.callsign,
    isLSO: state.user.isLSO,
    isStaff: state.user.isStaff,
    isAdmin: state.user.isAdmin,
    isTrainee: state.user.callsign,
  }),
  {
    fetchLayoutData,
    userLoginFromToken,
    logout,
  }
)(enhancedComponent)

export default ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={matchProps => (
        <Connected>
          <Component {...matchProps} />
        </Connected>
      )}
    />
  )
}
