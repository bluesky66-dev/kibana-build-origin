"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initSpacesViewsRoutes = initSpacesViewsRoutes;

var _common = require("../../../common");

var _errors = require("../../lib/errors");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function initSpacesViewsRoutes(deps) {
  deps.httpResources.register({
    path: '/spaces/space_selector',
    validate: false
  }, (context, request, response) => response.renderCoreApp());
  deps.httpResources.register({
    path: _common.ENTER_SPACE_PATH,
    validate: false
  }, async (context, request, response) => {
    try {
      const defaultRoute = await context.core.uiSettings.client.get('defaultRoute');
      const basePath = deps.basePath.get(request);
      const url = `${basePath}${defaultRoute}`;
      return response.redirected({
        headers: {
          location: url
        }
      });
    } catch (e) {
      deps.logger.error(`Error navigating to space: ${e}`);
      return response.customError((0, _errors.wrapError)(e));
    }
  });
}