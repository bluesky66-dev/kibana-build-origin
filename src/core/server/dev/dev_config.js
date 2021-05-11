"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DevConfig = exports.config = void 0;

var _configSchema = require("@kbn/config-schema");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const config = {
  path: 'dev',
  schema: _configSchema.schema.object({
    basePathProxyTarget: _configSchema.schema.number({
      defaultValue: 5603
    })
  })
};
exports.config = config;

class DevConfig {
  /**
   * @internal
   */
  constructor(rawConfig) {
    _defineProperty(this, "basePathProxyTargetPort", void 0);

    this.basePathProxyTargetPort = rawConfig.basePathProxyTarget;
  }

}

exports.DevConfig = DevConfig;