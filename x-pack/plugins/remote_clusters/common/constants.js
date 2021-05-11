"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PROXY_MODE = exports.SNIFF_MODE = exports.API_BASE_PATH = exports.PLUGIN = void 0;

var _i18n = require("@kbn/i18n");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const basicLicense = 'basic';
const PLUGIN = {
  // Remote Clusters are used in both CCS and CCR, and CCS is available for all licenses.
  minimumLicenseType: basicLicense,
  getI18nName: () => {
    return _i18n.i18n.translate('xpack.remoteClusters.appName', {
      defaultMessage: 'Remote Clusters'
    });
  }
};
exports.PLUGIN = PLUGIN;
const API_BASE_PATH = '/api/remote_clusters';
exports.API_BASE_PATH = API_BASE_PATH;
const SNIFF_MODE = 'sniff';
exports.SNIFF_MODE = SNIFF_MODE;
const PROXY_MODE = 'proxy';
exports.PROXY_MODE = PROXY_MODE;