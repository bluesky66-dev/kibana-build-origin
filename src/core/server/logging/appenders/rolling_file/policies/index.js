"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "TriggeringPolicy", {
  enumerable: true,
  get: function () {
    return _policy.TriggeringPolicy;
  }
});
exports.createTriggeringPolicy = exports.triggeringPolicyConfigSchema = void 0;

var _configSchema = require("@kbn/config-schema");

var _momentTimezone = _interopRequireDefault(require("moment-timezone"));

var _std = require("@kbn/std");

var _size_limit = require("./size_limit");

var _time_interval = require("./time_interval");

var _policy = require("./policy");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const defaultPolicy = {
  type: 'time-interval',
  interval: _momentTimezone.default.duration(24, 'hour'),
  modulate: true
};

const triggeringPolicyConfigSchema = _configSchema.schema.oneOf([_size_limit.sizeLimitTriggeringPolicyConfigSchema, _time_interval.timeIntervalTriggeringPolicyConfigSchema], {
  defaultValue: defaultPolicy
});

exports.triggeringPolicyConfigSchema = triggeringPolicyConfigSchema;

const createTriggeringPolicy = (config, context) => {
  switch (config.type) {
    case 'size-limit':
      return new _size_limit.SizeLimitTriggeringPolicy(config, context);

    case 'time-interval':
      return new _time_interval.TimeIntervalTriggeringPolicy(config, context);

    default:
      return (0, _std.assertNever)(config);
  }
};

exports.createTriggeringPolicy = createTriggeringPolicy;