export type env = {
    constructor_options: constructor_options;
    url: url;
    ssl: ssl;
    on_request: callback_event_request;
    on_error: callback_error;
};
export type constructor_options = {
    url: string | url;
    ssl?: ssl;
};
export type url = {
    type: 'http' | 'https';
    url: string;
    port: number;
    path?: string;
};
export type ssl = {
    key: Buffer;
    cert: Buffer;
};
export type request_method = "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "CONNECT" | "OPTIONS" | "TRACE";
export type request = {
    method: request_method;
    url: string;
    data: string;
    headers: any;
    reply: function_reply;
    reply_set_header: Function;
};
export type function_reply = (status_code: number, data: string | Buffer | any, callback?: callback_error) => any;
export type callback_event_request = (request: request) => any;
export type callback_error = (error: Error) => any;
export function stub(): void;
