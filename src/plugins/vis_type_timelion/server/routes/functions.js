"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.functionsRoute = functionsRoute;

var _lodash = _interopRequireDefault(require("lodash"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function functionsRoute(router, {
  functions
}) {
  router.get({
    path: '/api/timelion/functions',
    validate: false
  }, async (context, request, response) => {
    const functionArray = _lodash.default.map(functions, function (val, key) {
      // TODO: This won't work on frozen objects, it should be removed when everything is converted to datasources and chainables
      return _lodash.default.extend({}, val, {
        name: key
      });
    });

    return response.ok({
      body: _lodash.default.sortBy(functionArray, 'name')
    });
  });
}