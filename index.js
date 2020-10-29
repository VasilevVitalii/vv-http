// @ts-check
const lib_app = require('./app.js')
const type = require('./@type.js')
const get = require('./get.js')

exports.create = create
exports.get = get.get
exports.get_file = get.get_file

/**
 * @typedef {lib_app} app
 */
/**
 * @typedef {type.constructor_options} constructor_options
 */
/**
 * @typedef {type.request} request
 */
/**
 * @typedef {type.request_method} request_method
 */
/**
 * @typedef {type.function_reply} function_reply
 */

/**
 * @param {constructor_options} [options]
 */
function create(options) {
    return new lib_app(options)
}