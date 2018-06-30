import React from 'react'
import { Redirect } from 'react-router-dom'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'

const PrivateRoute = ({ children, authenticated, isLSO, location: { pathname } }) =>
  !authenticated ? (
    <Redirect to={{ pathname: `/login/?redirect=${pathname}` }} />
  ) : isLSO ? (
    <div>{children}</div>
  ) : (
    <NoPermission />
  )

const NoPermission = () => <div>Not enough permissions.</div>

const PrivateRouteWithRouter = withRouter(props => <PrivateRoute {...props} />)

export default connect(
  state => ({
    authenticated: state.user.authenticated,
    isLSO: state.user.isLSO,
  }),
  {}
)(PrivateRouteWithRouter)
