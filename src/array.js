
export const arrayFrom = (a) =>
    (a===undefined || a===null)
    ? []
    : (Array.isArray(a) ? a : [a])


export const arrayUnique = (arr) =>
    arr.reduce( (x,a) => {
        if (x.indexOf(a)>=0) return x
        x.push(a)
        return x
    }, [])


export const arraySplit = (arr, size) => {
    let a = [].concat(arr)
    let b = []
    while (a.length) {
        b.push(a.splice(0, size))
    }
    return b
}