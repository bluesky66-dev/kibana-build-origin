"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initializeUpdateCustomElementRoute = initializeUpdateCustomElementRoute;

var _configSchema = require("@kbn/config-schema");

var _lodash = require("lodash");

var _constants = require("../../../common/lib/constants");

var _custom_element_schema = require("./custom_element_schema");

var _ok_response = require("../ok_response");

var _catch_error_handler = require("../catch_error_handler");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function initializeUpdateCustomElementRoute(deps) {
  const {
    router
  } = deps;
  router.put({
    path: `${_constants.API_ROUTE_CUSTOM_ELEMENT}/{id}`,
    validate: {
      params: _configSchema.schema.object({
        id: _configSchema.schema.string()
      }),
      body: _custom_element_schema.CustomElementUpdateSchema
    },
    options: {
      body: {
        maxBytes: 26214400,
        // 25MB payload limit
        accepts: ['application/json']
      }
    }
  }, (0, _catch_error_handler.catchErrorHandler)(async (context, request, response) => {
    const payload = request.body;
    const id = request.params.id;
    const now = new Date().toISOString();
    const customElementObject = await context.core.savedObjects.client.get(_constants.CUSTOM_ELEMENT_TYPE, id);
    await context.core.savedObjects.client.create(_constants.CUSTOM_ELEMENT_TYPE, { ...customElementObject.attributes,
      ...(0, _lodash.omit)(payload, 'id'),
      // never write the id property
      '@timestamp': now,
      '@created': customElementObject.attributes['@created'] // ensure created is not modified

    }, {
      overwrite: true,
      id
    });
    return response.ok({
      body: _ok_response.okResponse
    });
  }));
}