// @ts-check
const lib_app = require('./app.js')
const type = require('./@type.js')
const get = require('./get.js')

exports.create = create
exports.get = get.get

/**
 * @typedef {lib_app} app
 */
/**
 * @typedef {type.constructor_options} http_constructor_options
 */

/**
 * @param {http_constructor_options} [options]
 */
function create(options) {
    return new lib_app(options)
}