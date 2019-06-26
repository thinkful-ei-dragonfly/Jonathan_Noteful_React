import React from 'react'
import ReactDOM from 'react-dom'
import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faPlus, faChevronLeft, faTrashAlt, faCheckDouble
} from '@fortawesome/free-solid-svg-icons'
import { BrowserRouter } from 'react-router-dom'
import 'typeface-roboto'
import './index.css'
import ErrorBoundary from '../src/ErrorBoundary/ErrorBoundary'
import App from './App/App'

library.add(faPlus, faChevronLeft, faTrashAlt, faCheckDouble)

ReactDOM.render(
  <BrowserRouter>
  <ErrorBoundary>
    <App />
    </ErrorBoundary>
  </BrowserRouter>,
  document.getElementById('root')
)
