"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "UIM_APP_NAME", {
  enumerable: true,
  get: function () {
    return _ui_metric.UIM_APP_NAME;
  }
});
Object.defineProperty(exports, "UIM_APP_LOAD", {
  enumerable: true,
  get: function () {
    return _ui_metric.UIM_APP_LOAD;
  }
});
Object.defineProperty(exports, "UIM_JOB_CREATE", {
  enumerable: true,
  get: function () {
    return _ui_metric.UIM_JOB_CREATE;
  }
});
Object.defineProperty(exports, "UIM_JOB_DELETE", {
  enumerable: true,
  get: function () {
    return _ui_metric.UIM_JOB_DELETE;
  }
});
Object.defineProperty(exports, "UIM_JOB_DELETE_MANY", {
  enumerable: true,
  get: function () {
    return _ui_metric.UIM_JOB_DELETE_MANY;
  }
});
Object.defineProperty(exports, "UIM_JOB_START", {
  enumerable: true,
  get: function () {
    return _ui_metric.UIM_JOB_START;
  }
});
Object.defineProperty(exports, "UIM_JOB_START_MANY", {
  enumerable: true,
  get: function () {
    return _ui_metric.UIM_JOB_START_MANY;
  }
});
Object.defineProperty(exports, "UIM_JOB_STOP", {
  enumerable: true,
  get: function () {
    return _ui_metric.UIM_JOB_STOP;
  }
});
Object.defineProperty(exports, "UIM_JOB_STOP_MANY", {
  enumerable: true,
  get: function () {
    return _ui_metric.UIM_JOB_STOP_MANY;
  }
});
Object.defineProperty(exports, "UIM_SHOW_DETAILS_CLICK", {
  enumerable: true,
  get: function () {
    return _ui_metric.UIM_SHOW_DETAILS_CLICK;
  }
});
Object.defineProperty(exports, "UIM_DETAIL_PANEL_SUMMARY_TAB_CLICK", {
  enumerable: true,
  get: function () {
    return _ui_metric.UIM_DETAIL_PANEL_SUMMARY_TAB_CLICK;
  }
});
Object.defineProperty(exports, "UIM_DETAIL_PANEL_TERMS_TAB_CLICK", {
  enumerable: true,
  get: function () {
    return _ui_metric.UIM_DETAIL_PANEL_TERMS_TAB_CLICK;
  }
});
Object.defineProperty(exports, "UIM_DETAIL_PANEL_HISTOGRAM_TAB_CLICK", {
  enumerable: true,
  get: function () {
    return _ui_metric.UIM_DETAIL_PANEL_HISTOGRAM_TAB_CLICK;
  }
});
Object.defineProperty(exports, "UIM_DETAIL_PANEL_METRICS_TAB_CLICK", {
  enumerable: true,
  get: function () {
    return _ui_metric.UIM_DETAIL_PANEL_METRICS_TAB_CLICK;
  }
});
Object.defineProperty(exports, "UIM_DETAIL_PANEL_JSON_TAB_CLICK", {
  enumerable: true,
  get: function () {
    return _ui_metric.UIM_DETAIL_PANEL_JSON_TAB_CLICK;
  }
});
exports.API_BASE_PATH = exports.CONFIG_ROLLUPS = exports.PLUGIN = void 0;

var _ui_metric = require("./ui_metric");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const basicLicense = 'basic';
const PLUGIN = {
  ID: 'rollup',
  minimumLicenseType: basicLicense
};
exports.PLUGIN = PLUGIN;
const CONFIG_ROLLUPS = 'rollups:enableIndexPatterns';
exports.CONFIG_ROLLUPS = CONFIG_ROLLUPS;
const API_BASE_PATH = '/api/rollup';
exports.API_BASE_PATH = API_BASE_PATH;