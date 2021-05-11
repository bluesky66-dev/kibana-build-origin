"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LICENSE_TYPE = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

let LICENSE_TYPE;
/** @public */

exports.LICENSE_TYPE = LICENSE_TYPE;

(function (LICENSE_TYPE) {
  LICENSE_TYPE[LICENSE_TYPE["basic"] = 10] = "basic";
  LICENSE_TYPE[LICENSE_TYPE["standard"] = 20] = "standard";
  LICENSE_TYPE[LICENSE_TYPE["gold"] = 30] = "gold";
  LICENSE_TYPE[LICENSE_TYPE["platinum"] = 40] = "platinum";
  LICENSE_TYPE[LICENSE_TYPE["enterprise"] = 50] = "enterprise";
  LICENSE_TYPE[LICENSE_TYPE["trial"] = 60] = "trial";
})(LICENSE_TYPE || (exports.LICENSE_TYPE = LICENSE_TYPE = {}));