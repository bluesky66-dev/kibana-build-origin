"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.API_BASE_PATH = exports.PLUGIN = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const basicLicense = 'basic';
const PLUGIN = {
  id: 'painlessLab',
  minimumLicenseType: basicLicense
};
exports.PLUGIN = PLUGIN;
const API_BASE_PATH = '/api/painless_lab';
exports.API_BASE_PATH = API_BASE_PATH;