"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  plugin: true,
  FeatureUsageServiceSetup: true,
  FeatureUsageServiceStart: true,
  config: true,
  CheckLicense: true,
  wrapRouteWithLicenseCheck: true
};
Object.defineProperty(exports, "FeatureUsageServiceSetup", {
  enumerable: true,
  get: function () {
    return _services.FeatureUsageServiceSetup;
  }
});
Object.defineProperty(exports, "FeatureUsageServiceStart", {
  enumerable: true,
  get: function () {
    return _services.FeatureUsageServiceStart;
  }
});
Object.defineProperty(exports, "config", {
  enumerable: true,
  get: function () {
    return _licensing_config.config;
  }
});
Object.defineProperty(exports, "CheckLicense", {
  enumerable: true,
  get: function () {
    return _wrap_route_with_license_check.CheckLicense;
  }
});
Object.defineProperty(exports, "wrapRouteWithLicenseCheck", {
  enumerable: true,
  get: function () {
    return _wrap_route_with_license_check.wrapRouteWithLicenseCheck;
  }
});
exports.plugin = void 0;

var _plugin = require("./plugin");

var _types = require("../common/types");

Object.keys(_types).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _types[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _types[key];
    }
  });
});

var _services = require("./services");

var _types2 = require("./types");

Object.keys(_types2).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _types2[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _types2[key];
    }
  });
});

var _licensing_config = require("./licensing_config");

var _wrap_route_with_license_check = require("./wrap_route_with_license_check");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const plugin = context => new _plugin.LicensingPlugin(context);

exports.plugin = plugin;