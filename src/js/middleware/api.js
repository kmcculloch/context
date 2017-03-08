import { normalize } from 'normalizr'
import Schemas from '../schemas'
import * as socket from './socket'
import 'isomorphic-fetch'

export const API_ROOT = `${__BUILD__.API_URL}/api`

// Fetches an API response and normalizes the result JSON according to schema.
// This makes every API response have the same shape, regardless of how nested it was.
function callApi(method, endpoint, schema, data) {
  let fullUrl = (endpoint.indexOf(API_ROOT) === -1) ? API_ROOT + endpoint : endpoint
  let body

  // add query params to GET requests listed on data
  if (data && method == "GET") {
    let addedFirst = false
    Object.keys(data).forEach((key, i) => {
      const val = encodeURIComponent(data[key])
      if (val != "") {
        fullUrl += (addedFirst) ? `&${key}=${val}` : `?${key}=${val}`
        addedFirst = true
      }
    })
  } else if (data) {
    body = JSON.stringify(data)
  }

  return fetch(fullUrl, {
    method : method,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    body
  })
    .then(response => {
      return response.json().then(json => ({ json, response }))
    }).then(({ json, response }) => {
      if (!response.ok) {
        return Promise.reject(json)
      } else if (response.status == 204) {
        return {}
      }

      const { data } = json

      return Object.assign({},
        normalize(data, schema)
        // { nextPageUrl }
      )
    });
}

// Action key that carries API call info interpreted by this Redux middleware.
export const CALL_API = Symbol('Call API')

// A Redux middleware that interprets actions with CALL_API info specified.
// Performs the call and promises when such actions are dispatched.
export default store => next => action => {
  const callAPI = action[CALL_API]
  if (typeof callAPI === 'undefined') {
    return next(action)
  }

  // if we have a websocket connection, use it instead.
  if (socket.connected()) {
    return socket.callApiAction(store, next, callAPI);
  }

  let { endpoint } = callAPI
  const { schema, types, data, method="GET", silentError=false } = callAPI

  if (typeof endpoint === 'function') {
    endpoint = endpoint(store.getState())
  }

  if (typeof endpoint !== 'string') {
    throw new Error('Specify a string endpoint URL.')
  }
  if (!schema) {
    throw new Error('Specify one of the exported Schemas.')
  }

  if (!Array.isArray(types) || types.length !== 3) {
    throw new Error('Expected an array of three action types.')
  }
  if (!types.every(type => typeof type === 'string')) {
    throw new Error('Expected action types to be strings.')
  }

  function actionWith(data) {
    const finalAction = Object.assign({}, action, data)
    delete finalAction[CALL_API]
    return finalAction
  }

  const [ requestType, successType, failureType ] = types

  // fire an action indicating a request has been made
  next(actionWith({ type: requestType }));

  // make the request
  return callApi(method, endpoint, schema, data).then(
    response => next(actionWith({
      type: successType,
      response
    })),
    error => {
      var msg = 'Something Bad Happened' 
      if (error.meta && error.meta.message) {
        msg = error.meta.message
      }
      return next(actionWith({
        type: failureType, 
        error: msg,
        silentError
      }))
    }
  )
}