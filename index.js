// @ts-check
const app = require('./app.js')
const type = require('./@type.js')
const get = require('./get.js')

exports.create = create
exports.get = get.get

/**
 * @param {type.constructor_options} [options]
 */
function create(options) {
    return new app(options)
}