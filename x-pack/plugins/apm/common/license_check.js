"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isActivePlatinumLicense = isActivePlatinumLicense;
exports.isActiveGoldLicense = isActiveGoldLicense;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function isActiveLicense(licenseType, license) {
  return license && license.isActive && license.hasAtLeast(licenseType);
}

function isActivePlatinumLicense(license) {
  return isActiveLicense('platinum', license);
}

function isActiveGoldLicense(license) {
  return isActiveLicense('gold', license);
}