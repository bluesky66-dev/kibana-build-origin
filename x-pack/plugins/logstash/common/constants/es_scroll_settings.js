"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ES_SCROLL_SETTINGS = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const ES_SCROLL_SETTINGS = {
  // How long to keep a scroll alive
  KEEPALIVE: '30s',
  // How many results to return per scroll response
  PAGE_SIZE: 100
};
exports.ES_SCROLL_SETTINGS = ES_SCROLL_SETTINGS;