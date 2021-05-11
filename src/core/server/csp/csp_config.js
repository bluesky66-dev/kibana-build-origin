"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CspConfig = void 0;

var _config = require("./config");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const DEFAULT_CONFIG = Object.freeze(_config.config.schema.validate({}));
/**
 * CSP configuration for use in Kibana.
 * @public
 */

/**
 * CSP configuration for use in Kibana.
 * @public
 */
class CspConfig {
  /**
   * Returns the default CSP configuration when passed with no config
   * @internal
   */
  constructor(rawCspConfig = {}) {
    _defineProperty(this, "rules", void 0);

    _defineProperty(this, "strict", void 0);

    _defineProperty(this, "warnLegacyBrowsers", void 0);

    _defineProperty(this, "header", void 0);

    const source = { ...DEFAULT_CONFIG,
      ...rawCspConfig
    };
    this.rules = source.rules;
    this.strict = source.strict;
    this.warnLegacyBrowsers = source.warnLegacyBrowsers;
    this.header = source.rules.join('; ');
  }

}

exports.CspConfig = CspConfig;

_defineProperty(CspConfig, "DEFAULT", new CspConfig());