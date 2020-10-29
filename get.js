//@ts-check

const path = require('path')
const vvs = require('vv-shared')
const http = require('http')
const https = require('https')
const fs = require('fs')
const partial = require('./app.partial.js')

exports.get = get

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
        protocol: undefined,
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
 * @property {string} [save_as_full_file_name]
 * @property {boolean} [add_to_full_file_name_original]
 */
/**
 * @callback callback_get_data
 * @param {Error} error
 * @param {Buffer} buffer
 * @param {string} url
 * @param {string} file_name
 */
/**
 * @param {string} url
 * @param {type_get_data} options
 * @param {callback_get_data} callback
 */
function get(url, options, callback) {
    let save_as_full_file_name = (vvs.isEmpty(options) ? undefined : vvs.toString(options.save_as_full_file_name))
    let add_to_full_file_name_original = (vvs.isEmpty(options) ? false : vvs.toBool(options.add_to_full_file_name_original, false))

    let callbacked = {send: false}

    let requester = get_requester(url)
    if (!vvs.isEmpty(requester.error)) {
        callback(requester.error, undefined, url, undefined)
        return
    }

    try {
        requester.protocol.get(url, requester.options, result => {
            let statusCode = vvs.toInt(vvs.findPropertyValueInObject(result, 'statusCode'), 200)
            let file_name = path.basename(url)

            let content_disposition = vvs.findPropertyValueInObject(result.headers, 'content-disposition', '')
            if (!vvs.isEmptyString(content_disposition)) {
                let reg = new RegExp('^filename=', 'i')
                let lexem = vvs.parser({end_of_command: ';'}).lexemify_tree(vvs.findPropertyValueInObject(result.headers, 'content-disposition', '')).filter(f => f.type === 'lexem' && reg.test(f.final))
                if (lexem.length > 0) {
                    file_name = lexem[0].final.substring(9, lexem[0].final.length)
                    file_name = vvs.border_del(file_name, '"', '"')
                    file_name = vvs.border_del(file_name, "'", "'")
                }
            }
            if (!vvs.isEmptyString(save_as_full_file_name) && add_to_full_file_name_original === true) {
                save_as_full_file_name = path.join(save_as_full_file_name, file_name)
            }

            if (statusCode === 302) {
                let next_url = vvs.toString(vvs.findPropertyValueInObject(result.headers, 'location'))
                if (vvs.isEmptyString(next_url)) {
                    if (!callbacked.send) {
                        callbacked.send = true
                        callback(new Error(vvs.format('request return statusCode {0}', statusCode)), undefined, url, file_name)
                    }
                    return
                }
                if (!callbacked.send) {
                    callbacked.send = true
                    get(next_url, options, callback)
                }
                return
            }

            if (statusCode !== 200) {
                if (!callbacked.send) {
                    callbacked.send = true
                    callback(new Error(vvs.format('request return statusCode {0}', statusCode)), undefined, url, file_name)
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
                        callback(error, undefined, url, file_name)
                    }
                })
                write_stream.on('finish', () => {
                    write_stream.removeAllListeners('error')
                    write_stream.removeAllListeners('finish')
                    write_stream = undefined
                    if (!callbacked.send) {
                        callbacked.send = true
                        callback(undefined, undefined, url, file_name)
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
                        callback(error, undefined, url, file_name)
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
                        callback(undefined, Buffer.concat(body), url, file_name)
                    }
                }
            }).on('error', (error) => {
                if (!callbacked.send) {
                    callbacked.send = true
                    callback(error, undefined, url, file_name)
                }
            })
        }).on('error', (error) => {
            if (!callbacked.send) {
                callbacked.send = true
                callback(error, undefined, url, undefined)
            }
        })
    } catch (error) {
        if (!callbacked.send) {
            callbacked.send = true
            callback(error, undefined, url, undefined)
        }
    }
}