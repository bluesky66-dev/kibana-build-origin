"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerScriptsRoute = registerScriptsRoute;

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function registerScriptsRoute(router) {
  router.get({
    path: '/api/kibana/scripts/languages',
    validate: false
  }, async (context, request, response) => {
    return response.ok({
      body: ['painless', 'expression']
    });
  });
}