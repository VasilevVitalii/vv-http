// @ts-check
const vvs = require('vv-shared')
const http = require('http')
const https = require('https')
const fs = require('fs')

exports.get_data = get_data

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
 * @param {string} path
 * @param {'http'|'https'} type
 * @param {type_get_data} [options]
 * @param {callback_get_data} callback
 */
function get_data(path, type, options, callback) {
    let save_as_full_file_name = (vvs.isEmpty(options) ? undefined : vvs.toString(options.save_as_full_file_name))

    let requester = undefined
    if (type === 'http') {
        requester = http
    } else if (type === 'https') {
        requester = https
    } else {
        callback(new Error('unknown request type = '.concat(type)), undefined)
        return
    }

    requester.get(path, result => {
        let statusCode = vvs.toInt(vvs.findPropertyValueInObject(result, 'statusCode'), 200)
        if (statusCode !== 200) {
            callback(new Error(vvs.format('request return statusCode {0}', statusCode)), undefined)
            return
        }

        let allow_file = !vvs.isEmptyString(save_as_full_file_name)

        let write_stream = undefined
        if (allow_file === true) {
            write_stream = fs.createWriteStream(save_as_full_file_name, {encoding: 'utf8', autoClose: false})
            write_stream.on('error', error => {
                write_stream.removeAllListeners('error')
                write_stream.removeAllListeners('finish')
                write_stream = undefined
                callback(error, undefined)
            })
            write_stream.on('finish', () => {
                write_stream.removeAllListeners('error')
                write_stream.removeAllListeners('finish')
                write_stream = undefined
                callback(undefined, undefined)
            })
        }

        let body = []
        result.on('data', chunk => {
            try {
                if (allow_file === true) {
                    if (!vvs.isEmpty(write_stream) && write_stream.destroyed !== true) {
                        write_stream.write(chunk)
                    }
                } else {
                    body.push(chunk)
                }
            } catch (error) {
                callback(error, undefined)
            }
        }).on('end', () => {
            if (allow_file === true) {
                if (!vvs.isEmpty(write_stream)) {
                    write_stream.close()
                }
            } else {
                callback(undefined, Buffer.concat(body))
            }
        }).on('error', (error) => {
            callback(error, undefined)
        })
    })
}
