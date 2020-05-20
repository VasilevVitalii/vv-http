//@ts-check

const vvs = require('vv-shared')
const http = require('http')
const https = require('https')
const fs = require('fs')
const partial = require('./app.partial.js')

exports.get = get

/**
 * @typedef type_get_data
 * @property {string} save_as_full_file_name
 */
/**
 * @callback callback_get_data
 * @param {Error} error
 * @param {Buffer} buffer
 */
/**
 * @param {string} url
 * @param {type_get_data} [options]
 * @param {callback_get_data} callback
 */
function get(url, options, callback) {
    let save_as_full_file_name = (vvs.isEmpty(options) ? undefined : vvs.toString(options.save_as_full_file_name))
    let u = partial.url_beautify(url)
    let callbacked = {send: false}

    let requester = undefined
    let request_options = undefined
    if (u.type === 'http') {
        requester = http
    }
    else if (u.type === 'https') {
        requester = https
        request_options = {rejectUnauthorized: false}
    }
    else {
        callback(new Error('unknown request type = '.concat(u.type)), undefined)
        return
    }

    try {
        requester.get(url, request_options, result => {
            let statusCode = vvs.toInt(vvs.findPropertyValueInObject(result, 'statusCode'), 200)
            if (statusCode !== 200) {
                if (!callbacked.send) {
                    callbacked.send = true
                    callback(new Error(vvs.format('request return statusCode {0}', statusCode)), undefined)
                }
                return
            }
            let allow_file = !vvs.isEmptyString(save_as_full_file_name)
            let write_stream = undefined
            if (allow_file === true) {
                write_stream = fs.createWriteStream(save_as_full_file_name, { encoding: 'utf8', autoClose: false })
                write_stream.on('error', error => {
                    write_stream.removeAllListeners('error')
                    write_stream.removeAllListeners('finish')
                    write_stream = undefined
                    if (!callbacked.send) {
                        callbacked.send = true
                        callback(error, undefined)
                    }
                })
                write_stream.on('finish', () => {
                    write_stream.removeAllListeners('error')
                    write_stream.removeAllListeners('finish')
                    write_stream = undefined
                    if (!callbacked.send) {
                        callbacked.send = true
                        callback(undefined, undefined)
                    }
                })
            }
            let body = []
            result.on('data', chunk => {
                try {
                    if (allow_file === true) {
                        if (!vvs.isEmpty(write_stream) && write_stream.destroyed !== true) {
                            write_stream.write(chunk)
                        }
                    }
                    else {
                        body.push(chunk)
                    }
                }
                catch (error) {
                    if (!callbacked.send) {
                        callbacked.send = true
                        callback(error, undefined)
                    }
                }
            }).on('end', () => {
                if (allow_file === true) {
                    if (!vvs.isEmpty(write_stream)) {
                        write_stream.close()
                    }
                }
                else {
                    if (!callbacked.send) {
                        callbacked.send = true
                        callback(undefined, Buffer.concat(body))
                    }
                }
            }).on('error', (error) => {
                if (!callbacked.send) {
                    callbacked.send = true
                    callback(error, undefined)
                }
            })
        }).on('error', (error) => {
            if (!callbacked.send) {
                callbacked.send = true
                callback(error, undefined)
            }
        })
    } catch (error) {
        if (!callbacked.send) {
            callbacked.send = true
            callback(error, undefined)
        }
    }
}
