"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.uiSettings = void 0;

var _i18n = require("@kbn/i18n");

var _configSchema = require("@kbn/config-schema");

var _common = require("../common");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const uiSettings = {
  // TODO: move this to vis_type_xy when vislib is removed
  // https://github.com/elastic/kibana/issues/56143
  [_common.DIMMING_OPACITY_SETTING]: {
    name: _i18n.i18n.translate('visTypeVislib.advancedSettings.visualization.dimmingOpacityTitle', {
      defaultMessage: 'Dimming opacity'
    }),
    value: 0.5,
    type: 'number',
    description: _i18n.i18n.translate('visTypeVislib.advancedSettings.visualization.dimmingOpacityText', {
      defaultMessage: 'The opacity of the chart items that are dimmed when highlighting another element of the chart. ' + 'The lower this number, the more the highlighted element will stand out. ' + 'This must be a number between 0 and 1.'
    }),
    category: ['visualization'],
    schema: _configSchema.schema.number()
  },
  [_common.HEATMAP_MAX_BUCKETS_SETTING]: {
    name: _i18n.i18n.translate('visTypeVislib.advancedSettings.visualization.heatmap.maxBucketsTitle', {
      defaultMessage: 'Heatmap maximum buckets'
    }),
    value: 50,
    type: 'number',
    description: _i18n.i18n.translate('visTypeVislib.advancedSettings.visualization.heatmap.maxBucketsText', {
      defaultMessage: 'The maximum number of buckets a single datasource can return. ' + 'A higher number might have negative impact on browser rendering performance'
    }),
    category: ['visualization'],
    schema: _configSchema.schema.number()
  }
};
exports.uiSettings = uiSettings;