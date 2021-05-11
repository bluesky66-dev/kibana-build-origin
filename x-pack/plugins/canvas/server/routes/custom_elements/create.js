"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initializeCreateCustomElementRoute = initializeCreateCustomElementRoute;

var _constants = require("../../../common/lib/constants");

var _get_id = require("../../../common/lib/get_id");

var _custom_element_schema = require("./custom_element_schema");

var _ok_response = require("../ok_response");

var _catch_error_handler = require("../catch_error_handler");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function initializeCreateCustomElementRoute(deps) {
  const {
    router
  } = deps;
  router.post({
    path: `${_constants.API_ROUTE_CUSTOM_ELEMENT}`,
    validate: {
      body: _custom_element_schema.CustomElementSchema
    },
    options: {
      body: {
        maxBytes: 26214400,
        // 25MB payload limit
        accepts: ['application/json']
      }
    }
  }, (0, _catch_error_handler.catchErrorHandler)(async (context, request, response) => {
    const customElement = request.body;
    const now = new Date().toISOString();
    const {
      id,
      ...payload
    } = customElement;
    await context.core.savedObjects.client.create(_constants.CUSTOM_ELEMENT_TYPE, { ...payload,
      '@timestamp': now,
      '@created': now
    }, {
      id: id || (0, _get_id.getId)('custom-element')
    });
    return response.ok({
      body: _ok_response.okResponse
    });
  }));
}