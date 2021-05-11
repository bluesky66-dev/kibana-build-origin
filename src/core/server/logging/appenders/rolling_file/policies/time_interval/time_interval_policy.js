"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TimeIntervalTriggeringPolicy = exports.timeIntervalTriggeringPolicyConfigSchema = void 0;

var _configSchema = require("@kbn/config-schema");

var _get_next_rolling_time = require("./get_next_rolling_time");

var _utils = require("./utils");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const timeIntervalTriggeringPolicyConfigSchema = _configSchema.schema.object({
  type: _configSchema.schema.literal('time-interval'),
  interval: _configSchema.schema.duration({
    defaultValue: '24h',
    validate: interval => {
      if (!(0, _utils.isValidRolloverInterval)(interval)) {
        return 'Interval value cannot overflow to a higher time unit.';
      }
    }
  }),
  modulate: _configSchema.schema.boolean({
    defaultValue: true
  })
});
/**
 * A triggering policy based on a fixed time interval
 */


exports.timeIntervalTriggeringPolicyConfigSchema = timeIntervalTriggeringPolicyConfigSchema;

class TimeIntervalTriggeringPolicy {
  /**
   * milliseconds timestamp of when the next rollover should occur.
   */
  constructor(config, context) {
    this.config = config;

    _defineProperty(this, "nextRolloverTime", void 0);

    this.nextRolloverTime = (0, _get_next_rolling_time.getNextRollingTime)(context.currentFileTime || Date.now(), config.interval, config.modulate);
  }

  isTriggeringEvent(record) {
    const eventTime = record.timestamp.getTime();

    if (eventTime >= this.nextRolloverTime) {
      this.nextRolloverTime = (0, _get_next_rolling_time.getNextRollingTime)(eventTime, this.config.interval, this.config.modulate);
      return true;
    }

    return false;
  }

}

exports.TimeIntervalTriggeringPolicy = TimeIntervalTriggeringPolicy;