"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initializeGetWorkpadRoute = initializeGetWorkpadRoute;

var _configSchema = require("@kbn/config-schema");

var _constants = require("../../../common/lib/constants");

var _catch_error_handler = require("../catch_error_handler");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function initializeGetWorkpadRoute(deps) {
  const {
    router
  } = deps;
  router.get({
    path: `${_constants.API_ROUTE_WORKPAD}/{id}`,
    validate: {
      params: _configSchema.schema.object({
        id: _configSchema.schema.string()
      })
    }
  }, (0, _catch_error_handler.catchErrorHandler)(async (context, request, response) => {
    const workpad = await context.core.savedObjects.client.get(_constants.CANVAS_TYPE, request.params.id);

    if ( // not sure if we need to be this defensive
    workpad.type === 'canvas-workpad' && workpad.attributes && workpad.attributes.pages && workpad.attributes.pages.length) {
      workpad.attributes.pages.forEach(page => {
        const elements = (page.elements || []).filter(({
          id: pageId
        }) => !pageId.startsWith('group'));
        const groups = (page.groups || []).concat((page.elements || []).filter(({
          id: pageId
        }) => pageId.startsWith('group')));
        page.elements = elements;
        page.groups = groups;
      });
    }

    return response.ok({
      body: {
        id: workpad.id,
        ...workpad.attributes
      }
    });
  }));
}