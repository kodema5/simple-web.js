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
const STORAGE_KEY = 'simple-web-state'
;(() => {
    let s = global.sessionStorage.getItem(STORAGE_KEY)
    state = parseJSON(s)
})()


global.addEventListener('beforeunload', (_) => {
    global.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state))
})