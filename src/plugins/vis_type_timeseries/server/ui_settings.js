"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.uiSettings = void 0;

var _i18n = require("@kbn/i18n");

var _configSchema = require("@kbn/config-schema");

var _constants = require("../common/constants");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const uiSettings = {
  [_constants.MAX_BUCKETS_SETTING]: {
    name: _i18n.i18n.translate('visTypeTimeseries.advancedSettings.maxBucketsTitle', {
      defaultMessage: 'TSVB buckets limit'
    }),
    value: 2000,
    description: _i18n.i18n.translate('visTypeTimeseries.advancedSettings.maxBucketsText', {
      defaultMessage: 'Affects the TSVB histogram density. Must be set higher than "histogram:maxBars".'
    }),
    schema: _configSchema.schema.number()
  }
};
exports.uiSettings = uiSettings;