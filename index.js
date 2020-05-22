// @ts-check
const app = require('./app.js')
const type = require('./@type.js')
const get = require('./get.js')

exports.create = create
exports.get = get.get

/**
 * @typedef {type.constructor_options} http_constructor_options
 */

/**
 * @param {http_constructor_options} [options]
 */
function create(options) {
    return new app(options)
}