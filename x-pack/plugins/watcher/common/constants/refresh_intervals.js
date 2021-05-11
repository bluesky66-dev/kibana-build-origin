"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.REFRESH_INTERVALS = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// In milliseconds

const SIXTY_SECONDS = 60 * 1000;
const REFRESH_INTERVALS = {
  WATCH_LIST: SIXTY_SECONDS,
  WATCH_HISTORY: SIXTY_SECONDS,
  WATCH_VISUALIZATION: SIXTY_SECONDS
};
exports.REFRESH_INTERVALS = REFRESH_INTERVALS;