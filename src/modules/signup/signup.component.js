import React from 'react'
import { Link } from 'react-router-dom'
import { Button, Form, Grid, Header, Message, Segment, Dimmer, Loader } from 'semantic-ui-react'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { userSignup, userSignupError } from './signup.reducer'
import styled from 'styled-components'
import { Field, reduxForm } from 'redux-form'

const required = value => (value ? undefined : 'Required')

const onSubmit = (userSignup, userSignupError, callsign, email, password, passwordTwo) => {
  if (password !== passwordTwo) userSignupError({ message: 'Your passwords do not match' })
  userSignup({ callsign, email, password })
}

const LoginForm = ({
  userSignup,
  userSignupError,
  callsign,
  email,
  password,
  passwordTwo,
  authenticated,
  loader,
  errMsg,
}) => (
  <div className="login-form">
    <div>{authenticated ? <Redirect to="/" push /> : ''}</div>
    <div>
      {loader ? (
        <LoaderComponent />
      ) : (
        <Grid textAlign="center" style={{ height: '100%' }} verticalAlign="middle">
          <Grid.Column style={{ maxWidth: 450 }}>
            <Header as="h2" textAlign="center">
              Create an account
            </Header>
            <Segment stacked>
              {errMsg ? <Error>{errMsg}</Error> : ''}
              <Form onSubmit={() => onSubmit(userSignup, userSignupError, callsign, email, password, passwordTwo)}>
                <StyledField
                  component="input"
                  type="text"
                  name="callsign"
                  placeholder={'callsign'}
                  validate={required}
                  required
                />
                <StyledField
                  component="input"
                  type="email"
                  name="email"
                  placeholder={'email'}
                  validate={required}
                  required
                />
                <StyledField
                  component="input"
                  type="password"
                  name="password"
                  placeholder={'password'}
                  validate={required}
                  required
                />
                <StyledField
                  component="input"
                  type="password"
                  name="passwordTwo"
                  placeholder={'confirm password'}
                  validate={required}
                  required
                />
                <Button fluid size="large" type={'submit'}>
                  Create Account
                </Button>
              </Form>
            </Segment>
            <Message>
              Already have an account? <Link to={`/login`}>Log in!</Link>
            </Message>
          </Grid.Column>
        </Grid>
      )}
    </div>
  </div>
)

const Login = reduxForm({
  // a unique name for the form
  form: 'signup',
})(LoginForm)

const LoaderComponent = () => (
  <DimmerContainer>
    <Dimmer active inverted>
      <Loader>Creating account</Loader>
    </Dimmer>
  </DimmerContainer>
)

export default connect(
  state => ({
    callsign: state.form.signup && state.form.signup.values && state.form.signup.values.callsign,
    email: state.form.signup && state.form.signup.values && state.form.signup.values.email,
    password: state.form.signup && state.form.signup.values && state.form.signup.values.password,
    passwordTwo: state.form.signup && state.form.signup.values && state.form.signup.values.passwordTwo,
    authenticated: state.user.authenticated,
    loader: state.signup.loader,
    errMsg: state.signup.error.message,
  }),
  {
    userSignup,
    userSignupError,
  }
)(Login)

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

const Error = styled.p`
  color: red;
`

const StyledField = styled(Field)`
  margin-top: 5px !important;
  margin-bottom: 10px !important;
`
