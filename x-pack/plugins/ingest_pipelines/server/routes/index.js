"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ApiRoutes = void 0;

var _api = require("./api");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


class ApiRoutes {
  setup(dependencies) {
    (0, _api.registerGetRoutes)(dependencies);
    (0, _api.registerCreateRoute)(dependencies);
    (0, _api.registerUpdateRoute)(dependencies);
    (0, _api.registerPrivilegesRoute)(dependencies);
    (0, _api.registerDeleteRoute)(dependencies);
    (0, _api.registerSimulateRoute)(dependencies);
    (0, _api.registerDocumentsRoute)(dependencies);
  }

}

exports.ApiRoutes = ApiRoutes;