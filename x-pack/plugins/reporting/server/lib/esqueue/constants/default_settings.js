"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defaultSettings = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const defaultSettings = {
  DEFAULT_SETTING_TIMEOUT: 10000,
  DEFAULT_SETTING_DATE_SEPARATOR: '-',
  DEFAULT_SETTING_INTERVAL: 'week',
  DEFAULT_SETTING_INDEX_SETTINGS: {
    number_of_shards: 1,
    auto_expand_replicas: '0-1'
  },
  DEFAULT_WORKER_CHECK_SIZE: 1
};
exports.defaultSettings = defaultSettings;