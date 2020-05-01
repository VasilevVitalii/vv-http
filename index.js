// @ts-check
const shared = require('./static.js')
const server = require('./server.js')

exports.get_data = shared.get_data
exports.url_beautify = shared.url_beautify
exports.server = server