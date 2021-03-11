export const sleep = async (ms) => await new Promise(r => setTimeout(r, ms))

export const Fn = (a) => (typeof a === 'function') ? a : (() => a)


export const bufferedFn = (fn, ms=1000 ) => {
    var tm
    return (...args) => {
        if (tm) clearTimeout(tm)
        tm = setTimeout(() => {
            fn.apply(null, args)
        }, ms)
    }
}


export const sortFn = (fn, dir=(1)) =>
    (a,b) => {
        let fa = fn(a)
        let fb = fn(b)
        return fa > fb ? (dir * 1) :
            fa < fb ? (dir * -1) :
            0
    }
