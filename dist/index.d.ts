export type app = lib_app;
export type constructor_options = {
    url: string | type.url;
    ssl?: type.ssl;
};
export type request = {
    method: type.request_method;
    url: string;
    data: string;
    headers: any;
    reply: type.function_reply;
    reply_set_header: Function;
};
export type request_method = "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "CONNECT" | "OPTIONS" | "TRACE";
export type function_reply = (status_code: number, data: any, callback?: type.callback_error) => any;
/**
 * @typedef {lib_app} app
 */
/**
 * @typedef {type.constructor_options} constructor_options
 */
/**
 * @typedef {type.request} request
 */
/**
 * @typedef {type.request_method} request_method
 */
/**
 * @typedef {type.function_reply} function_reply
 */
/**
 * @param {constructor_options} [options]
 */
export function create(options?: constructor_options): lib_app;
import lib_app = require("./app.js");
import type = require("./@type.js");
export { get };
