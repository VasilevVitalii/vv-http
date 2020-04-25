// @ts-check
const static = require('./static.js')
const server = require('./server.js')

exports.get_data = static.get_data
exports.server = server.go