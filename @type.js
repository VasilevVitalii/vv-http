// @ts-check

function stub () {}
exports.stub = stub

/**
 * @typedef env
 * @property {constructor_options} constructor_options
 * @property {url} url
 * @property {ssl} ssl
 * @property {callback_event_request} on_request
 * @property {callback_error} on_error
 */

/**
 * @typedef constructor_options
 * @property {string|url} url
 * @property {ssl} [ssl]
 */

/**
 * @typedef url
 * @property {'http'|'https'} type
 * @property {string} url
 * @property {number} port
 * @property {string} [path]
 */

/**
 * @typedef ssl
 * @property {Buffer} key
 * @property {Buffer} cert
 */

/**
 * @typedef {'GET'|'HEAD'|'POST'|'PUT'|'DELETE'|'CONNECT'|'OPTIONS'|'TRACE'} request_method
 */

/**
 * @typedef request
 * @property {request_method} method
 * @property {string} url
 * @property {string} data
 * @property {Object} headers
 * @property {function_reply} reply
 * @property {function} reply_set_header
 */

/**
 * @callback function_reply
 * @param {number} status_code
 * @param {string} data
 * @param {callback_error} [callback]
 */

/**
 * @callback callback_event_request
 * @param {request} request
 */

/**
 * @callback callback_error
 * @param {Error} error
 */