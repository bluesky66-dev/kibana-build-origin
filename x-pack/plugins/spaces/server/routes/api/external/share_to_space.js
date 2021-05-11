"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initShareToSpacesApi = initShareToSpacesApi;

var _configSchema = require("@kbn/config-schema");

var _errors = require("../../../lib/errors");

var _constants = require("../../../../common/constants");

var _space_schema = require("../../../lib/space_schema");

var _lib = require("../../lib");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const uniq = arr => Array.from(new Set(arr));

function initShareToSpacesApi(deps) {
  const {
    externalRouter,
    getStartServices
  } = deps;

  const shareSchema = _configSchema.schema.object({
    spaces: _configSchema.schema.arrayOf(_configSchema.schema.string({
      validate: value => {
        if (value !== _constants.ALL_SPACES_ID && !_space_schema.SPACE_ID_REGEX.test(value)) {
          return `lower case, a-z, 0-9, "_", and "-" are allowed, OR "*"`;
        }
      }
    }), {
      validate: spaceIds => {
        if (!spaceIds.length) {
          return 'must specify one or more space ids';
        } else if (uniq(spaceIds).length !== spaceIds.length) {
          return 'duplicate space ids are not allowed';
        }
      }
    }),
    object: _configSchema.schema.object({
      type: _configSchema.schema.string(),
      id: _configSchema.schema.string()
    })
  });

  externalRouter.post({
    path: '/api/spaces/_share_saved_object_add',
    validate: {
      body: shareSchema
    }
  }, (0, _lib.createLicensedRouteHandler)(async (_context, request, response) => {
    const [startServices] = await getStartServices();
    const scopedClient = startServices.savedObjects.getScopedClient(request);
    const spaces = request.body.spaces;
    const {
      type,
      id
    } = request.body.object;

    try {
      await scopedClient.addToNamespaces(type, id, spaces);
    } catch (error) {
      return response.customError((0, _errors.wrapError)(error));
    }

    return response.noContent();
  }));
  externalRouter.post({
    path: '/api/spaces/_share_saved_object_remove',
    validate: {
      body: shareSchema
    }
  }, (0, _lib.createLicensedRouteHandler)(async (_context, request, response) => {
    const [startServices] = await getStartServices();
    const scopedClient = startServices.savedObjects.getScopedClient(request);
    const spaces = request.body.spaces;
    const {
      type,
      id
    } = request.body.object;

    try {
      await scopedClient.deleteFromNamespaces(type, id, spaces);
    } catch (error) {
      return response.customError((0, _errors.wrapError)(error));
    }

    return response.noContent();
  }));
}