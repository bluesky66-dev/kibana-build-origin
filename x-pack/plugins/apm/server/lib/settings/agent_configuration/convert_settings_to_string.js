"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.convertConfigSettingsToString = convertConfigSettingsToString;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// needed for backwards compatability
// All settings except `transaction_sample_rate` and `transaction_max_spans` are stored as strings (they are stored as float and integer respectively)

function convertConfigSettingsToString(hit) {
  var _config$settings, _config$settings2;

  const config = hit._source;

  if ((_config$settings = config.settings) !== null && _config$settings !== void 0 && _config$settings.transaction_sample_rate) {
    config.settings.transaction_sample_rate = config.settings.transaction_sample_rate.toString();
  }

  if ((_config$settings2 = config.settings) !== null && _config$settings2 !== void 0 && _config$settings2.transaction_max_spans) {
    config.settings.transaction_max_spans = config.settings.transaction_max_spans.toString();
  }

  return hit;
}