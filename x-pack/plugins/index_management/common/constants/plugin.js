"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PLUGIN = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const basicLicense = 'basic';
const PLUGIN = {
  id: 'index_management',
  minimumLicenseType: basicLicense,
  getI18nName: i18n => i18n.translate('xpack.idxMgmt.appTitle', {
    defaultMessage: 'Index Management'
  })
};
exports.PLUGIN = PLUGIN;