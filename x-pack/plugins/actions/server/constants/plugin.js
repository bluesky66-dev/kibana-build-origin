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

const PLUGIN = {
  ID: 'actions',
  MINIMUM_LICENSE_REQUIRED: 'basic',
  // TODO: supposed to be changed up on requirements
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getI18nName: i18n => i18n.translate('xpack.actions.appName', {
    defaultMessage: 'Actions'
  })
};
exports.PLUGIN = PLUGIN;