"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VALID_FULL_LICENSE_MODES = exports.LICENSE_TYPE = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

let LICENSE_TYPE;
exports.LICENSE_TYPE = LICENSE_TYPE;

(function (LICENSE_TYPE) {
  LICENSE_TYPE[LICENSE_TYPE["BASIC"] = 0] = "BASIC";
  LICENSE_TYPE[LICENSE_TYPE["FULL"] = 1] = "FULL";
})(LICENSE_TYPE || (exports.LICENSE_TYPE = LICENSE_TYPE = {}));

const VALID_FULL_LICENSE_MODES = ['platinum', 'enterprise', 'trial'];
exports.VALID_FULL_LICENSE_MODES = VALID_FULL_LICENSE_MODES;