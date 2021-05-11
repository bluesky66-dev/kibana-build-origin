"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ConsoleAppender = void 0;

var _configSchema = require("@kbn/config-schema");

var _layouts = require("../../layouts/layouts");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const {
  literal,
  object
} = _configSchema.schema;

/**
 *
 * Appender that formats all the `LogRecord` instances it receives and logs them via built-in `console`.
 * @internal
 */
class ConsoleAppender {
  /**
   * Creates ConsoleAppender instance.
   * @param layout Instance of `Layout` sub-class responsible for `LogRecord` formatting.
   */
  constructor(layout) {
    this.layout = layout;
  }
  /**
   * Formats specified `record` and logs it via built-in `console`.
   * @param record `LogRecord` instance to be logged.
   */


  append(record) {
    // eslint-disable-next-line no-console
    console.log(this.layout.format(record));
  }
  /**
   * Disposes `ConsoleAppender`.
   */


  dispose() {// noop
  }

}

exports.ConsoleAppender = ConsoleAppender;

_defineProperty(ConsoleAppender, "configSchema", object({
  type: literal('console'),
  layout: _layouts.Layouts.configSchema
}));