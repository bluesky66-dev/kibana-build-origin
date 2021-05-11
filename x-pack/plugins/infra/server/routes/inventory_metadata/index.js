"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initInventoryMetaRoute = void 0;

var _configSchema = require("@kbn/config-schema");

var _boom = _interopRequireDefault(require("@hapi/boom"));

var _pipeable = require("fp-ts/lib/pipeable");

var _Either = require("fp-ts/lib/Either");

var _function = require("fp-ts/lib/function");

var _runtime_types = require("../../../common/runtime_types");

var _inventory_meta_api = require("../../../common/http_api/inventory_meta_api");

var _get_cloud_metadata = require("./lib/get_cloud_metadata");

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


const escapeHatch = _configSchema.schema.object({}, {
  unknowns: 'allow'
});

const initInventoryMetaRoute = libs => {
  const {
    framework
  } = libs;
  framework.registerRoute({
    method: 'post',
    path: '/api/infra/inventory/meta',
    validate: {
      body: escapeHatch
    }
  }, async (requestContext, request, response) => {
    try {
      const {
        sourceId,
        nodeType,
        currentTime
      } = (0, _pipeable.pipe)(_inventory_meta_api.InventoryMetaRequestRT.decode(request.body), (0, _Either.fold)((0, _runtime_types.throwErrors)(_boom.default.badRequest), _function.identity));
      const {
        configuration
      } = await libs.sources.getSourceConfiguration(requestContext.core.savedObjects.client, sourceId);
      const awsMetadata = await (0, _get_cloud_metadata.getCloudMetadata)(framework, requestContext, configuration, nodeType, currentTime);
      return response.ok({
        body: _inventory_meta_api.InventoryMetaResponseRT.encode(awsMetadata)
      });
    } catch (error) {
      return response.internalError({
        body: error.message
      });
    }
  });
};

exports.initInventoryMetaRoute = initInventoryMetaRoute;