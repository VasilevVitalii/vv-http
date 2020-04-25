// @ts-check
/**
 * @license MIT
 * @author Vitalii vasilev
 */

/**
* @typedef type_pair pair variable=value
* @property {string} variable variable
* @property {any} [value] value
*/

/** @private */
const lib_util = require('util')
/** @private */
const lib_event = require('events').EventEmitter
/** @private */
const lib_vconv = require('viva-convert')
/** @private */
const lib_http = require('http')
/** @private */
const lib_https = require('https')
/** @private */
const lib_url = require('url')
/** @private */
const lib_fs = require('fs')

module.exports = Server_http
lib_util.inherits(Server_http, lib_event)

/**
* @class  (license MIT) simple http server, full example - see example.js
*/
function Server_http() {
    if (!(this instanceof Server_http)) return new Server_http()
    lib_event.call(this)
}

/** {string} */
Server_http.prototype.ip = undefined
/** {number} */
Server_http.prototype.port = undefined
/** {any} */
Server_http.prototype.server = undefined
/** {any} */
Server_http.prototype.emit = Server_http.prototype.emit || undefined
/** {any} */
Server_http.prototype.on = Server_http.prototype.on || undefined

/**
 * start http server
 * @param {string} [ip] ip, default 127.0.0.1
 * @param {number} [port] port, default 3000
 */
Server_http.prototype.start = function start(ip, port) {

    if (!lib_vconv.isAbsent(this.server)) {
        throw new Error('Http server already running')
    }

    this.server = lib_http.createServer()
    this.ip = lib_vconv.toIp(ip,'127.0.0.1')
    this.port = lib_vconv.toInt(port, 3000)
    let self = this

    this.server.on('listening', function () {
        self.emit('listening', lib_vconv.toString(self.ip.concat(':',self.port.toString()),''))
    })

    this.server.on('request', function (incomingMessageHttp, serverResponseHttp) {

        let already_sent = false

        /**
         * @param {number} statusCode
         * @param {any} serverResponse
         * @param {type_pair[]} [headers]
         * @param {function} [callback]
         */
        let sender = function (statusCode, serverResponse, headers, callback) {
            if (!lib_vconv.isAbsent(headers) && Array.isArray(headers)) {
                headers.forEach(h => {
                    serverResponseHttp.setHeader(h.variable, h.value)
                })
            }

            if (!lib_vconv.isAbsent(serverResponse) && typeof serverResponse === 'object' && !Buffer.isBuffer(serverResponse)) {
                try {
                    let true_response_data = JSON.stringify(serverResponse)
                    serverResponse = true_response_data
                } catch (error) {
                }
            }

            if (!lib_vconv.isAbsent(statusCode)) {
                try {
                    serverResponseHttp.statusCode = statusCode
                    if (statusCode === 206) {
                        if (already_sent === false) {
                            serverResponseHttp.setHeader('Content-Type', 'text/html; charset=UTF-8')
                            serverResponseHttp.setHeader('Transfer-Encoding', 'chunked')
                        }
                        already_sent = true
                        serverResponseHttp.write(serverResponse, undefined, callback)
                    } else {
                        already_sent = true
                        serverResponseHttp.end(serverResponse, callback)
                    }

                    // self.emit('end', {
                    //     backParam: backParam,
                    //     incomingMessageHttp: incomingMessageHttp,
                    //     serverResponseHttp: serverResponseHttp,
                    //     incomingMessage: incomingMessage,
                    //     serverResponse: serverResponse,
                    //     serverResponseStatusCode: statusCode
                    // })
                } catch (error) {
                    self.emit ('error', error, sender, incomingMessageHttp, serverResponseHttp)
                }
            }
        }

    try {
        if (!lib_vconv.isAbsent(incomingMessageHttp.headers) && !lib_vconv.isEmpty(incomingMessageHttp.headers.origin)) {
            serverResponseHttp.setHeader('Access-Control-Allow-Origin', incomingMessageHttp.headers.origin)
        } else {
            serverResponseHttp.setHeader('Access-Control-Allow-Origin', '*')
        }

        serverResponseHttp.setHeader('Access-Control-Allow-Credentials', true)
        incomingMessageHttp.setEncoding('utf8')
        let data = ''

        incomingMessageHttp.on('data', function (part_data) {
            data += part_data
        })

        incomingMessageHttp.on('end', function () {
            try {
                //incomingMessage = data
                let emit_name = incomingMessageHttp.method.toLowerCase()
                if (lib_vconv.isEmpty(emit_name)) {
                    throw new Error('emit_name is empty')
                }
                if (lib_vconv.toString(incomingMessageHttp.url) === '/favicon.ico') {
                    sender(200, undefined)
                    return
                }
                if (!lib_vconv.isAbsent(incomingMessageHttp) && !lib_vconv.isEmpty(incomingMessageHttp.url)) {
                    let prev_url = incomingMessageHttp.url
                    try {
                        let u = lib_url.parse(incomingMessageHttp.url)
                        if (!lib_vconv.isEmpty(u.query)) {
                            incomingMessageHttp.url = incomingMessageHttp.url.substring(0, incomingMessageHttp.url.length - u.search.length)
                            let url_params = []
                            new URLSearchParams(u.query).forEach((value, name) => {
                                url_params.push({
                                    name: name,
                                    value: value
                                })
                            })
                            incomingMessageHttp.url_params = url_params
                        }
                    } catch (error) {
                        try {
                            incomingMessageHttp.url = prev_url
                        } catch (error) {
                        }
                    }
                }
                self.emit(emit_name, data, sender, incomingMessageHttp, serverResponseHttp)
            } catch (error) {
                self.emit ('error', error, sender, incomingMessageHttp, serverResponseHttp)
            }
        })

        } catch(error) {
            self.emit ('error', error, sender, incomingMessageHttp, serverResponseHttp)
        }
    })

    this.server.listen(this.port, this.ip)
}
