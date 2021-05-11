"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.JsonLayout = void 0;

var _momentTimezone = _interopRequireDefault(require("moment-timezone"));

var _std = require("@kbn/std");

var _configSchema = require("@kbn/config-schema");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const {
  literal,
  object
} = _configSchema.schema;
const jsonLayoutSchema = object({
  type: literal('json')
});
/** @internal */

/**
 * Layout that just converts `LogRecord` into JSON string.
 * @internal
 */
class JsonLayout {
  static errorToSerializableObject(error) {
    if (error === undefined) {
      return error;
    }

    return {
      message: error.message,
      type: error.name,
      stack_trace: error.stack
    };
  }

  format(record) {
    const log = {
      '@timestamp': (0, _momentTimezone.default)(record.timestamp).format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
      message: record.message,
      error: JsonLayout.errorToSerializableObject(record.error),
      log: {
        level: record.level.id.toUpperCase(),
        logger: record.context
      },
      process: {
        pid: record.pid
      }
    };
    const output = record.meta ? (0, _std.merge)(log, record.meta) : log;
    return JSON.stringify(output);
  }

}

exports.JsonLayout = JsonLayout;

_defineProperty(JsonLayout, "configSchema", jsonLayoutSchema);