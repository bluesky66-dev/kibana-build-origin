"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerKibanaSettings = registerKibanaSettings;

var _i18n = require("@kbn/i18n");

var _configSchema = require("@kbn/config-schema");

var _settings = require("../../common/constants/settings");

var _common = require("../../../file_upload/common");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function registerKibanaSettings(coreSetup) {
  coreSetup.uiSettings.register({
    [_settings.FILE_DATA_VISUALIZER_MAX_FILE_SIZE]: {
      name: _i18n.i18n.translate('xpack.ml.maxFileSizeSettingsName', {
        defaultMessage: 'File Data Visualizer maximum file upload size'
      }),
      value: _common.MAX_FILE_SIZE,
      description: _i18n.i18n.translate('xpack.ml.maxFileSizeSettingsDescription', {
        defaultMessage: 'Sets the file size limit when importing data in the File Data Visualizer. The highest supported value for this setting is 1GB.'
      }),
      category: ['machineLearning'],
      schema: _configSchema.schema.string(),
      validation: {
        regexString: '\\d+[mMgG][bB]',
        message: _i18n.i18n.translate('xpack.ml.maxFileSizeSettingsError', {
          defaultMessage: 'Should be a valid data size. e.g. 200MB, 1GB'
        })
      }
    },
    [_settings.ANOMALY_DETECTION_ENABLE_TIME_RANGE]: {
      name: _i18n.i18n.translate('xpack.ml.advancedSettings.enableAnomalyDetectionDefaultTimeRangeName', {
        defaultMessage: 'Enable time filter defaults for anomaly detection results'
      }),
      value: _settings.DEFAULT_ENABLE_AD_RESULTS_TIME_FILTER,
      schema: _configSchema.schema.boolean(),
      description: _i18n.i18n.translate('xpack.ml.advancedSettings.enableAnomalyDetectionDefaultTimeRangeDesc', {
        defaultMessage: 'Use the default time filter in the Single Metric Viewer and Anomaly Explorer. If not enabled, the results for the full time range of the job are displayed.'
      }),
      category: ['machineLearning']
    },
    [_settings.ANOMALY_DETECTION_DEFAULT_TIME_RANGE]: {
      name: _i18n.i18n.translate('xpack.ml.advancedSettings.anomalyDetectionDefaultTimeRangeName', {
        defaultMessage: 'Time filter defaults for anomaly detection results'
      }),
      type: 'json',
      value: JSON.stringify(_settings.DEFAULT_AD_RESULTS_TIME_FILTER, null, 2),
      description: _i18n.i18n.translate('xpack.ml.advancedSettings.anomalyDetectionDefaultTimeRangeDesc', {
        defaultMessage: 'The time filter selection to use when viewing anomaly detection job results.'
      }),
      schema: _configSchema.schema.object({
        from: _configSchema.schema.string(),
        to: _configSchema.schema.string()
      }),
      requiresPageReload: true,
      category: ['machineLearning']
    }
  });
}