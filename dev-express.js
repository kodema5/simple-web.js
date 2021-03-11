// a simple dev-server

const express = require('express')
const app = express()
const { createProxyMiddleware } = require('http-proxy-middleware')

app.use('/httpbin', createProxyMiddleware({
    target: 'https://httpbin.org',
    changeOrigin: true,
    pathRewrite: (path, req) => {
        let a = path.split('/').slice(2).join('/')
        console.log('httpbin>', a)
        return a
    }
}))

app.use('/public', createProxyMiddleware({
    target: 'http://localhost:8080',
    ws: true,
    pathRewrite: (path, req) => {
        let a = path.split('/').slice(2).join('/')
        console.log('public>', a)
        return a
    }
}))

// access to dapr
const daprPort = process.env.DAPR_HTTP_PORT || 3500
app.use('/api/:appId/:method', createProxyMiddleware({
    target: `http://localhost:${daprPort}`,
    pathRewrite: (path, req) => {
        let a = ['/v1.0/invoke', req.params.appId, 'method', req.params.method].join('/')
        console.log(`api> ${a}`)
        return a
    }
}))


const httpPort = process.env.SIMPLE_WEB_PORT || 3000
app.listen(httpPort,
    () => console.log(`dev.js listening at http://localhost:${httpPort}`))
