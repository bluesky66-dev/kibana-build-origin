"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Layouts = void 0;

var _configSchema = require("@kbn/config-schema");

var _std = require("@kbn/std");

var _json_layout = require("./json_layout");

var _pattern_layout = require("./pattern_layout");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const {
  oneOf
} = _configSchema.schema;

/** @internal */
class Layouts {
  /**
   * Factory method that creates specific `Layout` instances based on the passed `config` parameter.
   * @param config Configuration specific to a particular `Layout` implementation.
   * @returns Fully constructed `Layout` instance.
   */
  static create(config) {
    switch (config.type) {
      case 'json':
        return new _json_layout.JsonLayout();

      case 'pattern':
        return new _pattern_layout.PatternLayout(config.pattern, config.highlight);

      default:
        return (0, _std.assertNever)(config);
    }
  }

}

exports.Layouts = Layouts;

_defineProperty(Layouts, "configSchema", oneOf([_json_layout.JsonLayout.configSchema, _pattern_layout.PatternLayout.configSchema]));