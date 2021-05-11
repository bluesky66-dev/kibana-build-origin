"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isPopulatedObject = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const isPopulatedObject = arg => {
  return typeof arg === 'object' && arg !== null && Object.keys(arg).length > 0;
};

exports.isPopulatedObject = isPopulatedObject;