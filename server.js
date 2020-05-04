// @ts-check
const vvs = require('vv-shared')
const http = require('http')
const https = require('https')
const ssl = require('./self_signed_ssl.js')
const static = require('./static.js')

/**
 * @typedef {static.type_url_beautify} type_url_beautify
 */
/**
 * @typedef {'GET'|'HEAD'|'POST'|'PUT'|'DELETE'|'CONNECT'|'OPTIONS'|'TRACE'} type_request_method
 */
/**
 * @typedef type_request
 * @property {type_request_method} method
 * @property {string} url
 * @property {string} data
 * @property {Object} headers
 * @property {function_reply} reply
 * @property {function} reply_set_header
 */
/**
 * @typedef type_ssl
 * @property {Buffer} key
 * @property {Buffer} cert
 */
/**
 * @typedef type_options
 * @property {type_url_beautify} url
 * @property {type_ssl} [ssl]
 */
/**
 * @callback callback_error
 * @param {Error} error
 */
/**
 * @callback callback_request
 * @param {type_request} request
 */
/**
 * @callback function_reply
 * @param {number} status_code
 * @param {string} data
 * @param {callback_error} [callback]
 */
/**
 * @callback function_reply_set_header
 * @param {string} key
 * @param {string|boolean|number} value
 */

/** @type {callback_request} */
let callback_on_request = undefined
/** @type {callback_error} */
let callback_on_error = undefined

exports.start = start
exports.on_request = on_request
exports.on_error = on_error

/**
 * @param {type_options} options
 * @param {callback_error} [callback]
 */
function start(options, callback) {

    /** @type {type_options} */
    let opt = (vvs.isEmpty(options) ? {} : options)
    /** @type {type_url_beautify} */
    let opt_url = (vvs.isEmpty(opt) ? {} : opt.url)
    /** @type {type_ssl} */
    let opt_ssl = (vvs.isEmpty(opt) ? {} : opt.ssl)

    if (vvs.isEmptyString(opt_url.url)) {
        if (vvs.isFunction(callback)) {
            callback(new Error ('url is empty'))
        }
        return
    }
    if (vvs.isEmpty(opt_url.port)) {
        if (vvs.isFunction(callback)) {
            callback(new Error ('port is empty'))
        }
        return
    }

    /** @type {Object}  */
    let server = undefined
    if (opt_url.type === 'http') {
        server = http.createServer()
    } else if (opt_url.type === 'https') {
        server = https.createServer({
            key: (vvs.isEmpty(opt_ssl) ? ssl.key : opt_ssl.key),
            cert: (vvs.isEmpty(opt_ssl) ? ssl.cert : opt_ssl.cert)
        })
    } else {
        if (vvs.isFunction(callback)) {
            callback(new Error ('server type is empty or unknown'))
        }
        return
    }

    let o = {sended_callback_start: false}

    server.on('error', error => {
        if (o.sended_callback_start !== true) {
            o.sended_callback_start = true
            if (vvs.isFunction(callback)) {
                callback(error)
            }
        } else {
            if (vvs.isFunction(callback_on_error)) {
                callback_on_error(error)
            }
        }
    })

    server.on('listening', () => {
        if (o.sended_callback_start !== true) {
            o.sended_callback_start = true
            if (vvs.isFunction(callback)) {
                callback(undefined)
            }
        }
    })

    server.on('request', (incomingMessageHttp, serverResponseHttp) => {
        if (!vvs.isEmpty(incomingMessageHttp.headers) && !vvs.isEmpty(incomingMessageHttp.headers.origin)) {
            serverResponseHttp.setHeader('Access-Control-Allow-Origin', incomingMessageHttp.headers.origin)
        } else {
            serverResponseHttp.setHeader('Access-Control-Allow-Origin', '*')
        }
        incomingMessageHttp.setEncoding('utf8')
        serverResponseHttp.setHeader('Access-Control-Allow-Credentials', true)

        let data = ''
        incomingMessageHttp.on('data', part_data => {
            data += part_data
        })

        incomingMessageHttp.on('end', () => {
            incomingMessageHttp.removeAllListeners('data')
            incomingMessageHttp.removeAllListeners('end')

            /** @type {type_request_method} */
            // @ts-ignore
            let incoming_method = vvs.toString(incomingMessageHttp.method, '').toUpperCase()
            let incoming_url = vvs.toString(incomingMessageHttp.url, '/')

            if (!vvs.isEmptyString(opt_url.path)) {
                let checked_incoming_url = (incoming_url.length > opt_url.path.length ? incoming_url.substring(0, opt_url.path.length) : incoming_url)
                if (!vvs.equal(opt_url.path, checked_incoming_url)) {
                    serverResponseHttp.statusCode = 404
                    serverResponseHttp.end()
                    return
                }
            }

            /** @type {type_request} */
            let request = {
                method: incoming_method,
                url: incoming_url,
                data: data,
                headers:  incomingMessageHttp.headers,
                reply: function(status_code, data, callback) {
                    try {
                        serverResponseHttp.statusCode = vvs.toInt(status_code, 200)
                        serverResponseHttp.end(data, () => {
                            incomingMessageHttp = undefined
                            if (vvs.isFunction(callback)) {
                                callback(undefined)
                            }
                        })
                    } catch (error) {
                        if (vvs.isFunction(callback)) {
                            callback(error)
                        }
                    }
                },
                reply_set_header: function(key, value) {
                    serverResponseHttp.setHeader(key, value)
                }
            }

            if (vvs.isFunction(callback_on_request)) {
                callback_on_request(request)
            }
        })
    })

    try {
        server.listen(opt_url.port, opt_url.url)
    } catch (error) {
        if (o.sended_callback_start !== true) {
            o.sended_callback_start = true
            if (vvs.isFunction(callback)) {
                callback(undefined)
            }
        }
    }
}

/**
 * @param {callback_request} callback
 */
function on_request(callback) {
    callback_on_request = callback
}

/**
 * @param {callback_error} callback
 */
function on_error(callback) {
    callback_on_error = callback
}