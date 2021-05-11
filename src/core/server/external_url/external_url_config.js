"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ExternalUrlConfig = void 0;

var _utils = require("../utils");

var _config = require("./config");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const DEFAULT_CONFIG = Object.freeze(_config.config.schema.validate({}));
/**
 * External Url configuration for use in Kibana.
 * @public
 */

/**
 * External Url configuration for use in Kibana.
 * @public
 */
class ExternalUrlConfig {
  /**
   * Returns the default External Url configuration when passed with no config
   * @internal
   */
  constructor(rawConfig) {
    _defineProperty(this, "policy", void 0);

    this.policy = rawConfig.policy.map(entry => {
      if (entry.host) {
        // If the host contains a `[`, then it's likely an IPv6 address. Otherwise, append a `.` if it doesn't already contain one
        const hostToHash = entry.host && !entry.host.includes('[') && !entry.host.endsWith('.') ? `${entry.host}.` : entry.host;
        return { ...entry,
          host: (0, _utils.createSHA256Hash)(hostToHash)
        };
      }

      return entry;
    });
  }

}

exports.ExternalUrlConfig = ExternalUrlConfig;

_defineProperty(ExternalUrlConfig, "DEFAULT", new ExternalUrlConfig(DEFAULT_CONFIG));