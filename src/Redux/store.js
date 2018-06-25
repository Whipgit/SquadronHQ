import { createStore, compose, applyMiddleware } from 'redux'
import { createEpicMiddleware } from 'redux-observable'
import rootReducer from './reducers'
import epics from './epics'

// Epics Middleware
const epicsMiddleware = createEpicMiddleware(epics)

// Chrome Dev Tools Redux Debugger
const composeEnhancers =
  typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
        // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
      })
    : compose

const enhancer = composeEnhancers(applyMiddleware(epicsMiddleware))

export default createStore(rootReducer, enhancer)
