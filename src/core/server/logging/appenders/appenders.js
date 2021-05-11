"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Appenders = exports.appendersSchema = void 0;

var _configSchema = require("@kbn/config-schema");

var _std = require("@kbn/std");

var _legacy_appender = require("../../legacy/logging/appenders/legacy_appender");

var _layouts = require("../layouts/layouts");

var _console_appender = require("./console/console_appender");

var _file_appender = require("./file/file_appender");

var _rolling_file_appender = require("./rolling_file/rolling_file_appender");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * Config schema for validting the shape of the `appenders` key in in {@link LoggerContextConfigType} or
 * {@link LoggingConfigType}.
 *
 * @public
 */
const appendersSchema = _configSchema.schema.oneOf([_console_appender.ConsoleAppender.configSchema, _file_appender.FileAppender.configSchema, _legacy_appender.LegacyAppender.configSchema, _rolling_file_appender.RollingFileAppender.configSchema]);
/** @public */


exports.appendersSchema = appendersSchema;

/** @internal */
class Appenders {
  /**
   * Factory method that creates specific `Appender` instances based on the passed `config` parameter.
   * @param config Configuration specific to a particular `Appender` implementation.
   * @returns Fully constructed `Appender` instance.
   */
  static create(config) {
    switch (config.type) {
      case 'console':
        return new _console_appender.ConsoleAppender(_layouts.Layouts.create(config.layout));

      case 'file':
        return new _file_appender.FileAppender(_layouts.Layouts.create(config.layout), config.fileName);

      case 'rolling-file':
        return new _rolling_file_appender.RollingFileAppender(config);

      case 'legacy-appender':
        return new _legacy_appender.LegacyAppender(config.legacyLoggingConfig);

      default:
        return (0, _std.assertNever)(config);
    }
  }

}

exports.Appenders = Appenders;

_defineProperty(Appenders, "configSchema", appendersSchema);