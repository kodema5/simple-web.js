import { cleanObject } from './object'

export const defaultAjaxHeaders = {
    'Content-Type': 'application/json'
}

export const setDefaultAjaxHeader = (obj) =>
    cleanObject(Object.assign(defaultAjaxHeaders, obj))

export const ajax = ({
    url,
    data,
    input = (a) => a,
    output = (a) => a,

    headers, // to be overridden
    body, // for FormData, URLSearchParams, string, etc

    method = 'POST',
    timeout = 0,

    requestType = 'json', // json, text, any
    responseType = 'json', // arrayBuffer, blob, formData, json, text

} = {}) => {
    if (!url) throw new Error('missing required url')

	// validate data
    //
    data = input(data)

    // build fetch options
    //
    let fetchOpt = {
        method,
        headers: Object.assign({}, defaultAjaxHeaders, headers),
    }

    // fix-body
    let hasBody = !(method==='GET' || method==='HEAD')
    if (hasBody) {
        fetchOpt.body = body
        	|| requestBody(data, requestType)
    }

	// add abort
    var timedOut = false
    let abortCtrl = new AbortController()
    if (timeout) {
        setTimeout(() => {
            timedOut = true
            abortCtrl.abort()
        }, timeout)
    }
    fetchOpt.signal = abortCtrl.signal


    // fetch
    let response = fetch(url, fetchOpt)
    .then(r => {
        if (!r.ok) throw new Error('network error')
        return responseData(r, responseType)
    })
    .then(r => output(r))

    return {
        response,
        abort: () => abortCtrl.abort(),
        isTimedOut: () => timedOut
    }

}

const requestBody = (data, type) => {
    switch(type) {
        case "any": return data
        case "text": return data ? data.toString() : data
        case "json": return JSON.stringify({data})
    }

    throw new Error('unknown request data type')
}

const responseData = (res, type) => {
    switch(type) {
        case 'arrayBuffer': return res.arrayBuffer()
        case 'blob': return res.blob()
        case 'formData': return res.formData()
        case 'json': return res.json()
        case 'text': return res.text()
    }

    throw new Error('unknown response type')
}

export const ajaxFn = (cfg) => (data) => {
    let { response } = ajax(Object.assign({}, cfg, {data}))
    return response
}