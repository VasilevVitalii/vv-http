//@ts-check

const os = require('os')
const vvs = require('vv-shared')
const type = require('./@type.js')

exports.constructor_options_beautify = constructor_options_beautify
exports.url_beautify = url_beautify

/**
 * @param {type.constructor_options} constructor_options
 * @returns {constructor_options}
 */
function constructor_options_beautify(constructor_options) {
    /** @type {type.constructor_options} */
    let o = vvs.isEmptyString(constructor_options) ? {url: undefined, ssl: undefined} : constructor_options


    return {
        url: typeof o.url === 'string' ? o.url:
            {
                port: vvs.toInt(vvs.findPropertyValueInObject(o.url, 'port')),
                type: vvs.findPropertyValueInObject(o.url, 'type'),
                url: vvs.toString(vvs.findPropertyValueInObject(o.url, 'url')),
                path: vvs.toString(vvs.findPropertyValueInObject(o.url, 'path'))
            },
        ssl: vvs.isEmpty(o.ssl) || vvs.isEmpty(o.ssl.cert) || vvs.isEmpty(o.ssl.key) ? undefined : o.ssl,
    }
}

/**
 * @param {string} text
 * @returns {type.url}
 */
function url_beautify(text) {
    /** @type {type.url} */
    let url = {
        type: undefined,
        url: undefined,
        port: undefined,
        path: undefined
    }

    if (vvs.isEmptyString(text)) return url
    text = text.trim()

    if (vvs.equal(text.substring(0, 8), 'https://')) {
        url.type = 'https'
        text = text.substring(8, text.length).trim()
    } else if (vvs.equal(text.substring(0, 7), 'http://')) {
        url.type = 'http'
        text = text.substring(7, text.length).trim()
    } else {
        url.type = 'http'
    }
    if (vvs.isEmptyString(text)) return url

    let find_port = text.indexOf(':')
    if (find_port >= 0) {
        url.url = text.substring(0, find_port).trim()
        text = text.substring(find_port + 1, text.length).trim()

        let find_path = text.indexOf('/')
        if (find_path > 0) {
            url.port = vvs.toInt(text.substring(0, find_path).trim())
            url.path = text.substring(find_path, text.length).trim()
        } else {
            url.port = vvs.toInt(text.trim())
            url.path = '/'
            text = ''
        }
    } else {
        let find_url = text.indexOf('/')
        if (find_url > 0) {
            url.url = text.substring(0, find_url).trim()
            url.path = text.substring(find_url, text.length).trim()
        } else {
            url.url = text.trim()
            url.path = '/'
            text = ''
        }
    }

    return url
}