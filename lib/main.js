// Polyfills to support IE, etc.
import '@babel/polyfill'

// import necessary React/Redux libraries
import React from 'react'
import ReactDOM from 'react-dom'
import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import createLogger from 'redux-logger'
import ReactGA from 'react-ga'

// import OTP-RR components
import { createOtpReducer } from 'otp-react-redux'

// CSS imports
import 'otp-react-redux/dist/index.css'
import 'leaflet.polylinemeasure/Leaflet.PolylineMeasure.css'

import TrimetWebapp from './app'

// load the OTP configuration
const otpConfig = require('json-loader!yaml-loader!./config.yml')

const initialQuery = {
  from: {
    lat: 45.5246,
    lon: -122.6710
  },
  to: {
    lat: 45.5307,
    lon: -122.6647
  },
  type: 'ITINERARY'
}

// set up the Redux store
const store = createStore(
  combineReducers({
    otp: createOtpReducer(otpConfig) // add optional initial query here
  }),
  compose(
    applyMiddleware(thunk, createLogger())
  )
)

// render the app
const render = App => ReactDOM.render(
  <Provider store={store}><App /></Provider>,
  document.getElementById('main')
)

render(TrimetWebapp)

// analytics
if (otpConfig.analytics && otpConfig.analytics.google) {
  ReactGA.initialize(otpConfig.analytics.google.globalSiteTag)
  ReactGA.pageview(window.location.pathname + window.location.search)
}
