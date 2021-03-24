import { setObject, getObject, parseJSON } from './object'

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


// maintain state across page load
//
const STORAGE_KEY = 'web-state'

export const saveState = () => {
    global.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

export const loadState = () => {
    let s = global.sessionStorage.getItem(STORAGE_KEY)
    state = parseJSON(s)
}

// load state on loading
//
loadState()

global.addEventListener('beforeunload', saveState)
