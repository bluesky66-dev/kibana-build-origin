"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.withApmSpan = withApmSpan;

var _apmUtils = require("@kbn/apm-utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function withApmSpan(optionsOrName, cb) {
  const options = (0, _apmUtils.parseSpanOptions)(optionsOrName);
  const optionsWithDefaults = {
    type: 'plugin:apm',
    ...options,
    labels: {
      plugin: 'apm',
      ...options.labels
    }
  };
  return (0, _apmUtils.withSpan)(optionsWithDefaults, cb);
}