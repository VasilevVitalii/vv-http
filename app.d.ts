export = App;
declare class App {
    /**
     * @param {type.constructor_options} [options]
     */
    constructor(options?: type.constructor_options);
    /** @type {type.env} */
    _env: type.env;
    /**
     * @param {type.callback_event_request} callback
     */
    on_request(callback: type.callback_event_request): void;
    /**
     * @param {type.callback_error} callback
     */
    on_error(callback: type.callback_error): void;
    /**
     * @param {type.callback_error} [callback]
     */
    start(callback?: type.callback_error): void;
}
import type = require("./@type.js");
