"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ApiRoutes = void 0;

var _license = require("./api/license");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


class ApiRoutes {
  setup(dependencies) {
    (0, _license.registerLicenseRoute)(dependencies);
    (0, _license.registerStartTrialRoutes)(dependencies);
    (0, _license.registerStartBasicRoute)(dependencies);
    (0, _license.registerPermissionsRoute)(dependencies);
  }

}

exports.ApiRoutes = ApiRoutes;