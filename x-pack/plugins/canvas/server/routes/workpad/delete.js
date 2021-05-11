"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initializeDeleteWorkpadRoute = initializeDeleteWorkpadRoute;

var _configSchema = require("@kbn/config-schema");

var _constants = require("../../../common/lib/constants");

var _ok_response = require("../ok_response");

var _catch_error_handler = require("../catch_error_handler");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function initializeDeleteWorkpadRoute(deps) {
  const {
    router
  } = deps;
  router.delete({
    path: `${_constants.API_ROUTE_WORKPAD}/{id}`,
    validate: {
      params: _configSchema.schema.object({
        id: _configSchema.schema.string()
      })
    }
  }, (0, _catch_error_handler.catchErrorHandler)(async (context, request, response) => {
    context.core.savedObjects.client.delete(_constants.CANVAS_TYPE, request.params.id);
    return response.ok({
      body: _ok_response.okResponse
    });
  }));
}