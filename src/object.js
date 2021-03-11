import { isEmpty } from './is'

export const cleanObject = (obj) => {
    let v = {}
    for (let k in obj) {
        let a = obj[k]
        if (isEmpty(a)) continue
        v[k] = a
    }
    return v
}

export const setObject = (root, path, value) => {

    let keys = path.split('.')
    let lastKey = keys.pop()

    var r = root || {}
    keys.forEach(k => {
        if (!r.hasOwnProperty(k)) r[k] = {}
        r = r[k]
    })

    r[lastKey] = value

    return root
}


export const getObject = (root, path, defaultValue) => {
    let keys = path.split('.')
    let r = root || {}
    for (let k of keys) {
        if (!r.hasOwnProperty(k)) return defaultValue
        r = r[k]
    }
    return r
}

export const deleteObject = (root, path) => {
    let keys = path.split('.')
    let lastKey = keys.pop()

    var r = root || {}
    for (let k of keys) {
        if (!r.hasOwnProperty(k)) return false
        r = r[k]
    }

    return delete r[lastKey]
}

export const parseJSON = (s, defaultValue) => {
    try {
        return JSON.parse(s)
    } catch(x) {
        return defaultValue
    }
}