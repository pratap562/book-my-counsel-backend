const http = require('http')
const express = require('express')
const app = express()
const httpserver = http.createServer(app)

module.exports = { app, httpserver }