//@ts-check
const vvs = require('vv-shared')
const type = require('./@type.js')
const partial = require('./app.partial.js')
const http = require('http')
const https = require('https')
const sss = require('./self_signed_ssl.js')

class App {
    /**
     * @param {type.constructor_options} [options]
     */
    constructor (options) {
        let constructor_options_beauty = partial.constructor_options_beautify(options)

        /** @type {type.env} */
        this._env = {
            constructor_options: constructor_options_beauty,
            url: typeof constructor_options_beauty.url === 'string' ? partial.url_beautify(constructor_options_beauty.url) :
            {
                port: constructor_options_beauty.url.port,
                type: constructor_options_beauty.url.type,
                url: constructor_options_beauty.url.url,
                path: constructor_options_beauty.url.path
            },
            ssl: vvs.isEmpty(constructor_options_beauty.ssl) ? {key: sss.key, cert: sss.cert} : constructor_options_beauty.ssl,
            on_error: undefined,
            on_request: undefined
        }
    }

    /**
     * @param {type.callback_event_request} callback
     */
    on_request(callback) {
        this._env.on_request  = callback
    }

    /**
     * @param {type.callback_error} callback
     */
    on_error(callback) {
        this._env.on_error  = callback
    }

    /**
     * @param {type.callback_error} [callback]
     */
    start(callback) {
        if (vvs.isEmptyString(this._env.url.url)) {
            if (vvs.isFunction(callback)) {
                callback(new Error ('url is empty'))
            }
            return
        }
        if (vvs.isEmpty(this._env.url.port)) {
            if (vvs.isFunction(callback)) {
                callback(new Error ('port is empty'))
            }
            return
        }

        /** @type {Object}  */
        let server = undefined
        if (this._env.url.type === 'http') {
            server = http.createServer()
        } else if (this._env.url.type === 'https') {
            server = https.createServer({
                key: this._env.ssl.key,
                cert: this._env.ssl.cert,
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
                if (vvs.isFunction(this.on_error)) {
                    this.on_error(error)
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

                /** @type {type.request_method} */
                // @ts-ignore
                let incoming_method = vvs.toString(incomingMessageHttp.method, '').toUpperCase()
                let incoming_url = vvs.toString(incomingMessageHttp.url, '/')

                if (!vvs.isEmptyString(this._env.url.path)) {
                    let checked_incoming_url = (incoming_url.length > this._env.url.path.length ? incoming_url.substring(0, this._env.url.path.length) : incoming_url)
                    if (!vvs.equal(this._env.url.path, checked_incoming_url)) {
                        serverResponseHttp.statusCode = 404
                        serverResponseHttp.end()
                        return
                    }
                }

                /** @type {type.request} */
                let request = {
                    method: incoming_method,
                    url: incoming_url,
                    data: data,
                    headers:  incomingMessageHttp.headers,
                    reply: function(status_code, data, callback) {
                        try {
                            let data_string = ''
                            if (typeof data === 'string') {
                                data_string = data
                            } else if (typeof data === 'object') {
                                data_string = JSON.stringify(data)
                            } else {
                                data_string = vvs.toString(data)
                            }

                            serverResponseHttp.statusCode = vvs.toInt(status_code, 200)
                            serverResponseHttp.end(data_string, () => {
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

                if (vvs.isFunction(this._env.on_request)) {
                    this._env.on_request(request)
                }
            })
        })

        try {
            server.listen(this._env.url.port, this._env.url.url)
        } catch (error) {
            if (o.sended_callback_start !== true) {
                o.sended_callback_start = true
                if (vvs.isFunction(callback)) {
                    callback(undefined)
                }
            }
        }
    }
}

module.exports = App