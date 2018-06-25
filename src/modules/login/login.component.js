import React from 'react'
import { Button, Form, Grid, Header, Message, Segment, Dimmer, Loader } from 'semantic-ui-react'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { userLogin } from './login.reducer'
import styled from 'styled-components'
import { Field, reduxForm } from 'redux-form'

const LoginForm = ({ userLogin, email, password, authenticated, loader }) => (
  <div className="login-form">
    <div>{authenticated ? <Redirect to="/" push /> : ''}</div>
    <div>
      {loader ? (
        <LoaderComponent />
      ) : (
        <Grid textAlign="center" style={{ height: '100%' }} verticalAlign="middle">
          <Grid.Column style={{ maxWidth: 450 }}>
            <Header as="h2" textAlign="center">
              Log-in to your account
            </Header>
            <Segment stacked>
              <Form onSubmit={() => userLogin({ email, password })}>
                <Field component="input" type="email" name="email" placeholder={'email'} />
                <Field component="input" type="password" name="password" placeholder={'password'} />
                <Button color="teal" fluid size="large" type={'submit'}>
                  Login
                </Button>
              </Form>
            </Segment>
            <Message>
              New to us? <a href="#">Sign Up</a>
            </Message>
          </Grid.Column>
        </Grid>
      )}
    </div>
  </div>
)

const Login = reduxForm({
  // a unique name for the form
  form: 'login',
})(LoginForm)

const LoaderComponent = () => (
  <DimmerContainer>
    <Dimmer active inverted>
      <Loader>Logging in</Loader>
    </Dimmer>
  </DimmerContainer>
)

export default connect(
  state => ({
    email: state.form.login && state.form.login.values && state.form.login.values.email,
    password: state.form.login && state.form.login.values && state.form.login.values.password,
    authenticated: state.user.authenticated,
    loader: state.user.loader,
  }),
  {
    userLogin,
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
