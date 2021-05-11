"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SizeLimitTriggeringPolicy = exports.sizeLimitTriggeringPolicyConfigSchema = void 0;

var _configSchema = require("@kbn/config-schema");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const sizeLimitTriggeringPolicyConfigSchema = _configSchema.schema.object({
  type: _configSchema.schema.literal('size-limit'),
  size: _configSchema.schema.byteSize({
    min: '1b',
    defaultValue: '100mb'
  })
});
/**
 * A triggering policy based on a fixed size limit.
 *
 * Will trigger a rollover when the current log size exceed the
 * given {@link SizeLimitTriggeringPolicyConfig.size | size}.
 */


exports.sizeLimitTriggeringPolicyConfigSchema = sizeLimitTriggeringPolicyConfigSchema;

class SizeLimitTriggeringPolicy {
  constructor(config, context) {
    this.context = context;

    _defineProperty(this, "maxFileSize", void 0);

    this.maxFileSize = config.size.getValueInBytes();
  }

  isTriggeringEvent(record) {
    return this.context.currentFileSize >= this.maxFileSize;
  }

}

exports.SizeLimitTriggeringPolicy = SizeLimitTriggeringPolicy;