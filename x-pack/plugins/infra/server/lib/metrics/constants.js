"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EMPTY_RESPONSE = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const EMPTY_RESPONSE = {
  series: [],
  info: {
    total: 0,
    afterKey: null,
    interval: 0
  }
};
exports.EMPTY_RESPONSE = EMPTY_RESPONSE;