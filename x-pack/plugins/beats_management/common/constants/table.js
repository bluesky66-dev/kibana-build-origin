"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TABLE_CONFIG = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const TABLE_CONFIG = {
  INITIAL_ROW_SIZE: 5,
  PAGE_SIZE_OPTIONS: [3, 5, 10, 20],
  TRUNCATE_TAG_LENGTH: 33,
  TRUNCATE_TAG_LENGTH_SMALL: 20
};
exports.TABLE_CONFIG = TABLE_CONFIG;