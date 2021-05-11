"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isHexColor = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const hexColorRegexp = /^#([0-9a-f]{6}|[0-9a-f]{3})$/i;

const isHexColor = color => {
  return hexColorRegexp.test(color);
};

exports.isHexColor = isHexColor;