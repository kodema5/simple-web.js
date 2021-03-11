export const isEmpty = (a) => (a==null) || (a==='') || (Array.isArray(a) && a.length===0)

export const isString = (a) => (typeof a === 'string')

export const isBoolean = (a) => (typeof a === 'boolean')

export const isObject = (a) => (a !== null && typeof a ==='object')

