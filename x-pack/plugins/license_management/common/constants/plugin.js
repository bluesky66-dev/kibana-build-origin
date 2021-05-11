"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PLUGIN = void 0;

var _i18n = require("@kbn/i18n");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const PLUGIN = {
  title: _i18n.i18n.translate('xpack.licenseMgmt.managementSectionDisplayName', {
    defaultMessage: 'License Management'
  }),
  id: 'license_management'
};
exports.PLUGIN = PLUGIN;