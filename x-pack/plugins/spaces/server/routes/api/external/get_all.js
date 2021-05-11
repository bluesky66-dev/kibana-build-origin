"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initGetAllSpacesApi = initGetAllSpacesApi;

var _configSchema = require("@kbn/config-schema");

var _errors = require("../../../lib/errors");

var _lib = require("../../lib");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function initGetAllSpacesApi(deps) {
  const {
    externalRouter,
    log,
    getSpacesService
  } = deps;
  externalRouter.get({
    path: '/api/spaces/space',
    validate: {
      query: _configSchema.schema.object({
        purpose: _configSchema.schema.maybe(_configSchema.schema.oneOf([_configSchema.schema.literal('any'), _configSchema.schema.literal('copySavedObjectsIntoSpace'), _configSchema.schema.literal('shareSavedObjectsIntoSpace')])),
        include_authorized_purposes: _configSchema.schema.conditional(_configSchema.schema.siblingRef('purpose'), _configSchema.schema.string(), _configSchema.schema.maybe(_configSchema.schema.literal(false)), _configSchema.schema.maybe(_configSchema.schema.boolean()))
      })
    }
  }, (0, _lib.createLicensedRouteHandler)(async (context, request, response) => {
    log.debug(`Inside GET /api/spaces/space`);
    const {
      purpose,
      include_authorized_purposes: includeAuthorizedPurposes
    } = request.query;
    const spacesClient = getSpacesService().createSpacesClient(request);
    let spaces;

    try {
      log.debug(`Attempting to retrieve all spaces for ${purpose} purpose with includeAuthorizedPurposes=${includeAuthorizedPurposes}`);
      spaces = await spacesClient.getAll({
        purpose,
        includeAuthorizedPurposes
      });
      log.debug(`Retrieved ${spaces.length} spaces for ${purpose} purpose with includeAuthorizedPurposes=${includeAuthorizedPurposes}`);
    } catch (error) {
      log.debug(`Error retrieving spaces for ${purpose} purpose with includeAuthorizedPurposes=${includeAuthorizedPurposes}: ${error}`);
      return response.customError((0, _errors.wrapError)(error));
    }

    return response.ok({
      body: spaces
    });
  }));
}