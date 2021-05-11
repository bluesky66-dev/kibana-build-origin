"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.calculatedInterval = void 0;

var _lodash = require("lodash");

var _calculate_metric_interval = require("../../../utils/calculate_metric_interval");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const calculatedInterval = async (search, options) => {
  const useModuleInterval = options.timerange.interval === 'modules' && (0, _lodash.isArray)(options.modules) && options.modules.length > 0;
  const calcualatedInterval = useModuleInterval ? await (0, _calculate_metric_interval.calculateMetricInterval)(search, {
    indexPattern: options.indexPattern,
    timestampField: options.timerange.field,
    timerange: {
      from: options.timerange.from,
      to: options.timerange.to
    }
  }, options.modules) : false;
  const defaultInterval = options.timerange.interval === 'modules' ? 'auto' : options.timerange.interval;
  return (0, _lodash.isNumber)(calcualatedInterval) ? `>=${calcualatedInterval}s` : defaultInterval;
};

exports.calculatedInterval = calculatedInterval;