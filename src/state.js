import { setObject, getObject, parseJSON } from './object'
import { SESSION_STORAGE_ID } from './const'

export var state = null

export const setState = (path, value) => {
    state = setObject(state || {}, path, value)
}

export const getState = (path, defaultValue) => state && path
    ? getObject(state , path, defaultValue)
    : state

export const removeState = (path) => state && deleteObject(state, path)

export const clearState = () => {
    state = null
    global.sessionStorage.clear()
}

export const saveState = () => {
    global.sessionStorage.setItem(SESSION_STORAGE_ID, JSON.stringify(state))
}

export const loadState = () => {
    let s = global.sessionStorage.getItem(SESSION_STORAGE_ID)
    state = parseJSON(s)
}

// maintain state on page reload
//
loadState()
global.addEventListener('beforeunload', saveState)
