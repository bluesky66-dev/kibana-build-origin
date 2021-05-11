"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.licenseService = void 0;

var _license = require("../../../common/license/license");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const licenseService = new _license.LicenseService();
exports.licenseService = licenseService;