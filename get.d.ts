/// <reference types="node" />
export type type_requester = {
    protocol: typeof http | typeof https;
    options: any;
    error: Error;
};
export type type_get_data = {
    save_as_full_file_name?: string;
    add_to_full_file_name_original?: boolean;
};
export type callback_get_data = (error: Error, buffer: Buffer, url: string, file_name: string) => any;
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
export function get(url: string, options: type_get_data, callback: callback_get_data): void;
import http = require("http");
import https = require("https");
