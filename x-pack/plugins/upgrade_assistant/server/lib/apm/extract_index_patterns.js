"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.extractIndexPatterns = void 0;

var _lodash = require("lodash");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const extractIndexPatterns = apmConfig => {
  const indexConfigs = (0, _lodash.pick)(apmConfig, ['sourcemapIndices', 'errorIndices', 'transactionIndices', 'spanIndices', 'metricsIndices', 'onboardingIndices']);
  return (0, _lodash.uniq)(Object.values(indexConfigs));
};

exports.extractIndexPatterns = extractIndexPatterns;