"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isObjectWithKeys = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const isObjectWithKeys = value => {
  return typeof value === 'object' && !!value && Object.keys(value).length > 0;
};

exports.isObjectWithKeys = isObjectWithKeys;