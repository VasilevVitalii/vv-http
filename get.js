//@ts-check

const path = require('path')
const vvs = require('vv-shared')
const http = require('http')
const https = require('https')
const fs = require('fs')
const partial = require('./app.partial.js')

exports.get = get
exports.get_file = get_file

/**
 * @typedef type_requester
 * @property {http|https} protocol
 * @property {Object} options
 * @property {Error} error
 */

/**
 * @param {string} url
 * @returns {type_requester}
 */
function get_requester(url) {
    /** @type {type_requester} */
    let res = {
        error: undefined,
        options: undefined,
        protocol: undefined
    }

    try {
        let u = partial.url_beautify(url)
        if (u.type === 'http') {
            res.protocol = http
        }
        else if (u.type === 'https') {
            res.protocol = https
            res.options = {rejectUnauthorized: false}
        } else {
            res.error = new Error('unknown request type = '.concat(u.type))
        }
        return res
    } catch (error) {
        res.error = error
        return res
    }
}

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
 * @param {type_get_data} options
 * @param {callback_get_data} callback
 */
function get(url, options, callback) {
    let save_as_full_file_name = (vvs.isEmpty(options) ? undefined : vvs.toString(options.save_as_full_file_name))
    let callbacked = {send: false}

    let requester = get_requester(url)
    if (!vvs.isEmpty(requester.error)) {
        callback(requester.error, undefined)
        return
    }

    try {
        requester.protocol.get(url, requester.options, result => {
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

/**
 * @typedef type_get_file
 * @property {string} save_as_file_path
 * @property {'ORIGINAL_FILE_NAME'|string} save_as_file_name
 */
/**
 * @callback callback_get_file
 * @param {Error} error
 * @param {Buffer} buffer
 * @param {string} name
 */
/**
 * @param {string} url
 * @param {type_get_file} options
 * @param {callback_get_file} callback
 */
function get_file(url, options, callback) {
    let callbacked = {send: false}

    let requester = get_requester(url)
    if (!vvs.isEmpty(requester.error)) {
        if (!callbacked.send) {
            callbacked.send = true
            callback(requester.error, undefined, undefined)
        }
        return

    }
    try {
        let file_name = undefined
        requester.protocol.get(url, requester.options, result => {
            let statusCode = vvs.toInt(vvs.findPropertyValueInObject(result, 'statusCode'), 302)
            if (statusCode !== 302) {
                if (!callbacked.send) {
                    callbacked.send = true
                    callback(new Error(vvs.format('request return statusCode {0}', statusCode)), undefined, undefined)
                }
                return
            }
            let url_with_file_name = vvs.toString(vvs.findPropertyValueInObject(result.headers, 'location'))
            if (vvs.isEmptyString(url_with_file_name)) {
                if (!callbacked.send) {
                    callbacked.send = true
                    callback(new Error('cant find file location in headers'), undefined, undefined)
                }
                return
            }
            file_name = path.basename(url_with_file_name)
            if (vvs.isEmptyString(file_name)) {
                if (!callbacked.send) {
                    callbacked.send = true
                    callback(new Error(vvs.format('cant get file name from file location {0}', url_with_file_name)), undefined, undefined)
                }
                return
            }

            /** @type {type_get_data} */
            let get_options = undefined
            if (!vvs.isEmpty(options) && !vvs.isEmptyString(options.save_as_file_name) && !vvs.isEmptyString(options.save_as_file_path)) {
                get_options = {
                    save_as_full_file_name : path.join(
                        options.save_as_file_path,
                        options.save_as_file_name === 'ORIGINAL_FILE_NAME' ? file_name : options.save_as_file_name
                        )
                }
            }

            get(url_with_file_name, get_options, (error, buffer) => {
                if (!vvs.isEmpty(error)) {
                    if (!callbacked.send) {
                        callbacked.send = true
                        callback(error, undefined, undefined)
                    }
                    return
                }
                if (!callbacked.send) {
                    callbacked.send = true
                    callback(undefined, buffer, file_name)
                }
            })
        })
    } catch (error) {
        if (!callbacked.send) {
            callbacked.send = true
            callback(error, undefined, undefined)
        }
    }

}