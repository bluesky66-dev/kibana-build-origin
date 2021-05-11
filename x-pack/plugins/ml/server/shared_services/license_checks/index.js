"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "LicenseCheck", {
  enumerable: true,
  get: function () {
    return _license_checks.LicenseCheck;
  }
});
Object.defineProperty(exports, "licenseChecks", {
  enumerable: true,
  get: function () {
    return _license_checks.licenseChecks;
  }
});
Object.defineProperty(exports, "InsufficientBasicLicenseError", {
  enumerable: true,
  get: function () {
    return _errors.InsufficientBasicLicenseError;
  }
});
Object.defineProperty(exports, "InsufficientFullLicenseError", {
  enumerable: true,
  get: function () {
    return _errors.InsufficientFullLicenseError;
  }
});

var _license_checks = require("./license_checks");

var _errors = require("./errors");