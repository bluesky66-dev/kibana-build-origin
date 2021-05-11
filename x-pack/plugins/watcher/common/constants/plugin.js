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
  ID: 'watcher',
  MINIMUM_LICENSE_REQUIRED: 'gold',
  getI18nName: i18n => {
    return i18n.translate('xpack.watcher.appName', {
      defaultMessage: 'Watcher'
    });
  }
};
exports.PLUGIN = PLUGIN;