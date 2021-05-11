"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ML_BASE_PATH = exports.ML_APP_NAME = exports.PLUGIN_ICON_SOLUTION = exports.PLUGIN_ICON = exports.PLUGIN_ID = void 0;

var _i18n = require("@kbn/i18n");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const PLUGIN_ID = 'ml';
exports.PLUGIN_ID = PLUGIN_ID;
const PLUGIN_ICON = 'machineLearningApp';
exports.PLUGIN_ICON = PLUGIN_ICON;
const PLUGIN_ICON_SOLUTION = 'logoKibana';
exports.PLUGIN_ICON_SOLUTION = PLUGIN_ICON_SOLUTION;

const ML_APP_NAME = _i18n.i18n.translate('xpack.ml.navMenu.mlAppNameText', {
  defaultMessage: 'Machine Learning'
});

exports.ML_APP_NAME = ML_APP_NAME;
const ML_BASE_PATH = '/api/ml';
exports.ML_BASE_PATH = ML_BASE_PATH;