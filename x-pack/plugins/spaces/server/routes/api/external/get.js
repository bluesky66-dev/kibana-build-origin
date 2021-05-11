"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initGetSpaceApi = initGetSpaceApi;

var _configSchema = require("@kbn/config-schema");

var _server = require("../../../../../../../src/core/server");

var _errors = require("../../../lib/errors");

var _lib = require("../../lib");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function initGetSpaceApi(deps) {
  const {
    externalRouter,
    getSpacesService
  } = deps;
  externalRouter.get({
    path: '/api/spaces/space/{id}',
    validate: {
      params: _configSchema.schema.object({
        id: _configSchema.schema.string()
      })
    }
  }, (0, _lib.createLicensedRouteHandler)(async (context, request, response) => {
    const spaceId = request.params.id;
    const spacesClient = getSpacesService().createSpacesClient(request);

    try {
      const space = await spacesClient.get(spaceId);
      return response.ok({
        body: space
      });
    } catch (error) {
      if (_server.SavedObjectsErrorHelpers.isNotFoundError(error)) {
        return response.notFound();
      }

      return response.customError((0, _errors.wrapError)(error));
    }
  }));
}