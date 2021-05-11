"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.licenseChecks = licenseChecks;

var _errors = require("./errors");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function licenseChecks(mlLicense) {
  return {
    isFullLicense() {
      if (mlLicense.isFullLicense() === false) {
        throw new _errors.InsufficientFullLicenseError('Platinum, Enterprise or trial license needed');
      }
    },

    isMinimumLicense() {
      if (mlLicense.isMinimumLicense() === false) {
        throw new _errors.InsufficientBasicLicenseError('Basic license needed');
      }
    }

  };
}