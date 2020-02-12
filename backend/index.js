const express = require('express')
const httpProxy = require('http-proxy')
// const brain = require('brainjs')

const app = express()
require('express-ws')(app)

const proxy = httpProxy.createProxyServer()

app.ws('/ws', ws => {
  ws.on('message', function(msg) {
    console.log({msg})
  })
})

app.all('/*', (req, res) => {
  proxy.web(req, res, {target: 'http://localhost:5000'})
})

app.listen(4321)
