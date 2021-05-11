"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initDeleteSpacesApi = initDeleteSpacesApi;

var _boom = _interopRequireDefault(require("@hapi/boom"));

var _configSchema = require("@kbn/config-schema");

var _server = require("../../../../../../../src/core/server");

var _errors = require("../../../lib/errors");

var _lib = require("../../lib");

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function initDeleteSpacesApi(deps) {
  const {
    externalRouter,
    log,
    getSpacesService
  } = deps;
  externalRouter.delete({
    path: '/api/spaces/space/{id}',
    validate: {
      params: _configSchema.schema.object({
        id: _configSchema.schema.string()
      })
    }
  }, (0, _lib.createLicensedRouteHandler)(async (context, request, response) => {
    const spacesClient = getSpacesService().createSpacesClient(request);
    const id = request.params.id;

    try {
      await spacesClient.delete(id);
    } catch (error) {
      if (_server.SavedObjectsErrorHelpers.isNotFoundError(error)) {
        return response.notFound();
      } else if (_server.SavedObjectsErrorHelpers.isEsCannotExecuteScriptError(error)) {
        log.error(`Failed to delete space '${id}', cannot execute script in Elasticsearch query: ${error.message}`);
        return response.customError((0, _errors.wrapError)(_boom.default.badRequest('Cannot execute script in Elasticsearch query')));
      }

      return response.customError((0, _errors.wrapError)(error));
    }

    return response.noContent();
  }));
}