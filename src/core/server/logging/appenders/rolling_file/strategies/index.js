"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "RollingStrategy", {
  enumerable: true,
  get: function () {
    return _strategy.RollingStrategy;
  }
});
exports.createRollingStrategy = exports.rollingStrategyConfigSchema = void 0;

var _configSchema = require("@kbn/config-schema");

var _numeric = require("./numeric");

var _strategy = require("./strategy");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const defaultStrategy = {
  type: 'numeric',
  pattern: '-%i',
  max: 7
};

const rollingStrategyConfigSchema = _configSchema.schema.oneOf([_numeric.numericRollingStrategyConfigSchema], {
  defaultValue: defaultStrategy
});

exports.rollingStrategyConfigSchema = rollingStrategyConfigSchema;

const createRollingStrategy = (config, context) => {
  return new _numeric.NumericRollingStrategy(config, context);
};

exports.createRollingStrategy = createRollingStrategy;