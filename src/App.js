import React from 'react'
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'
import { Provider } from 'react-redux'
import { Helmet } from 'react-helmet'
import styled from 'styled-components'

import Favicon from 'react-favicon'
import fav from './favicon.png'
import './App.css'
import store from './Redux/store'
import MainLayout from './layouts/main.layout'
import Squadron from './modules/squadron/squadron.component'
import Homepage from './modules/homepage/homepage.component'
import Pilot from './modules/pilot/pilot.component'
import Login from './modules/login/login.component'
import Signup from './modules/signup/signup.component'

const App = () => (
  <div className="App">
    <Helmet>
      <meta charSet="utf-8" />
      <title>Squadron HQ</title>
      <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.3.1/semantic.min.css" />
    </Helmet>
    <Favicon url={[fav]} />
    <div>
      <Switch>
        <Route exact path="/">
          <MainLayout path="/" component={Homepage} />
        </Route>
        <MainLayout path="/squadron/:squadronId" component={Squadron} />
        <MainLayout path="/pilot/:callsign" component={Pilot} />
        <MainLayout path="/login" component={Login} />
        <MainLayout path="/signup" component={Signup} />
        <Route component={() => <div>404</div>} />
      </Switch>
    </div>
  </div>
)

const AppWithStore = () => (
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
)

export default AppWithStore
