"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initializeUpdateWorkpadRoute = initializeUpdateWorkpadRoute;
exports.initializeUpdateWorkpadAssetsRoute = initializeUpdateWorkpadAssetsRoute;

var _configSchema = require("@kbn/config-schema");

var _lodash = require("lodash");

var _constants = require("../../../common/lib/constants");

var _workpad_schema = require("./workpad_schema");

var _ok_response = require("../ok_response");

var _catch_error_handler = require("../catch_error_handler");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const AssetsRecordSchema = _configSchema.schema.recordOf(_configSchema.schema.string(), _workpad_schema.WorkpadAssetSchema);

const AssetPayloadSchema = _configSchema.schema.object({
  assets: AssetsRecordSchema
});

const workpadUpdateHandler = async (payload, id, savedObjectsClient, response) => {
  const now = new Date().toISOString();
  const workpadObject = await savedObjectsClient.get(_constants.CANVAS_TYPE, id);
  await savedObjectsClient.create(_constants.CANVAS_TYPE, { ...workpadObject.attributes,
    ...(0, _lodash.omit)(payload, 'id'),
    // never write the id property
    '@timestamp': now,
    // always update the modified time
    '@created': workpadObject.attributes['@created'] // ensure created is not modified

  }, {
    overwrite: true,
    id
  });
  return response.ok({
    body: _ok_response.okResponse
  });
};

function initializeUpdateWorkpadRoute(deps) {
  const {
    router
  } = deps; // TODO: This route is likely deprecated and everything is using the workpad_structures
  // path instead. Investigate further.

  router.put({
    path: `${_constants.API_ROUTE_WORKPAD}/{id}`,
    validate: {
      params: _configSchema.schema.object({
        id: _configSchema.schema.string()
      }),
      body: _workpad_schema.WorkpadSchema
    },
    options: {
      body: {
        maxBytes: 26214400,
        accepts: ['application/json']
      }
    }
  }, (0, _catch_error_handler.catchErrorHandler)(async (context, request, response) => {
    return workpadUpdateHandler(request.body, request.params.id, context.core.savedObjects.client, response);
  }));
  router.put({
    path: `${_constants.API_ROUTE_WORKPAD_STRUCTURES}/{id}`,
    validate: {
      params: _configSchema.schema.object({
        id: _configSchema.schema.string()
      }),
      body: _workpad_schema.WorkpadSchema
    },
    options: {
      body: {
        maxBytes: 26214400,
        accepts: ['application/json']
      }
    }
  }, (0, _catch_error_handler.catchErrorHandler)(async (context, request, response) => {
    return workpadUpdateHandler(request.body, request.params.id, context.core.savedObjects.client, response);
  }));
}

function initializeUpdateWorkpadAssetsRoute(deps) {
  const {
    router
  } = deps;
  router.put({
    path: `${_constants.API_ROUTE_WORKPAD_ASSETS}/{id}`,
    validate: {
      params: _configSchema.schema.object({
        id: _configSchema.schema.string()
      }),
      // ToDo: Currently the validation must be a schema.object
      // Because we don't know what keys the assets will have, we have to allow
      // unknowns and then validate in the handler
      body: _configSchema.schema.object({}, {
        unknowns: 'allow'
      })
    },
    options: {
      body: {
        maxBytes: 26214400,
        accepts: ['application/json']
      }
    }
  }, async (context, request, response) => {
    return workpadUpdateHandler({
      assets: AssetsRecordSchema.validate(request.body)
    }, request.params.id, context.core.savedObjects.client, response);
  });
}