"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.logsSpecProvider = void 0;

var _path = _interopRequireDefault(require("path"));

var _i18n = require("@kbn/i18n");

var _saved_objects = require("./saved_objects");

var _field_mappings = require("./field_mappings");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const logsName = _i18n.i18n.translate('home.sampleData.logsSpecTitle', {
  defaultMessage: 'Sample web logs'
});

const logsDescription = _i18n.i18n.translate('home.sampleData.logsSpecDescription', {
  defaultMessage: 'Sample data, visualizations, and dashboards for monitoring web logs.'
});

const initialAppLinks = [];

const logsSpecProvider = function () {
  return {
    id: 'logs',
    name: logsName,
    description: logsDescription,
    previewImagePath: '/plugins/home/assets/sample_data_resources/logs/dashboard.png',
    darkPreviewImagePath: '/plugins/home/assets/sample_data_resources/logs/dashboard_dark.png',
    overviewDashboard: 'edf84fe0-e1a0-11e7-b6d5-4dc382ef7f5b',
    appLinks: initialAppLinks,
    defaultIndex: '90943e30-9a47-11e8-b64d-95841ca0b247',
    savedObjects: (0, _saved_objects.getSavedObjects)(),
    dataIndices: [{
      id: 'logs',
      dataPath: _path.default.join(__dirname, './logs.json.gz'),
      fields: _field_mappings.fieldMappings,
      timeFields: ['timestamp', 'utc_time'],
      currentTimeMarker: '2018-08-01T00:00:00',
      preserveDayOfWeekTimeOfDay: true
    }],
    status: 'not_installed'
  };
};

exports.logsSpecProvider = logsSpecProvider;