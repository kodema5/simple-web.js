import { getObject, setObject } from './object'
import { ajaxFn } from './ajax'

// api stores various user-defined ajax/fn

export const api = {}

export const setApi = (args) => {
    Object.entries(args)
    .forEach(([key, cfg]) => {
        let fn = typeof cfg === 'function'
            ? cfg
            : ajaxFn(cfg)
        setObject(api, key, fn)
    })

    return api
}

