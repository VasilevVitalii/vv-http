// @ts-check
const vvs = require('vv-shared')
const http = require('http')
const https = require('https')
const fs = require('fs')

exports.go = go

/**
 * @typedef type_request
 * @property {string} method
 * @property {string} url
 * @property {string} data
 * @property {Object} headers
 * @property {function} reply
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
 * @param {string} ip
 * @param {number} port
 * @param {callback_error} [callback_start]
 * @param {callback_request} callback_request
 * @param {callback_error} [callback_error]
 */

function go(ip, port, callback_start, callback_request, callback_error) {

    let server = http.createServer()

    let sended_callback_start = false

    server.on('error', error => {
        if (sended_callback_start !== true) {
            sended_callback_start = true
            if (vvs.isFunction(callback_start)) {
                callback_start(error)
            }
        } else {
            if (vvs.isFunction(callback_error)) {
                callback_error(error)
            }
        }
    })

    server.on('listening', () => {
        if (sended_callback_start !== true) {
            sended_callback_start = true
            if (vvs.isFunction(callback_start)) {
                callback_start(undefined)
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
        incomingMessageHttp.on('data', function (part_data) {
            data += part_data
        })

        incomingMessageHttp.on('end', function () {
            incomingMessageHttp.removeAllListeners('data')
            incomingMessageHttp.removeAllListeners('end')

            /** @type {type_request} */
            let request = {
                method: incomingMessageHttp.method,
                url: incomingMessageHttp.url,
                data: data,
                headers:  incomingMessageHttp.headers,
                reply: function(statusCode, data, callback_send) {
                    try {
                        serverResponseHttp.statusCode = vvs.toInt(statusCode, 200)
                        serverResponseHttp.end(data, () => {
                            incomingMessageHttp = undefined
                            if (vvs.isFunction(callback_send)) {
                                callback_send(undefined)
                            }
                        })
                    } catch (error) {
                        if (vvs.isFunction(callback_send)) {
                            callback_send(error)
                        }
                    }
                }
            }

            if (vvs.isFunction(callback_request)) {
                callback_request(request)
            }
        })
    })

    try {
        server.listen(port, ip)
    } catch (error) {
        let a = 5
    }
}