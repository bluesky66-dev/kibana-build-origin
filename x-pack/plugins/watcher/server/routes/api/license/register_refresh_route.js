"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerRefreshRoute = registerRefreshRoute;

var _license_pre_routing_factory = require("../../../lib/license_pre_routing_factory");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/*
In order for the client to have the most up-to-date snapshot of the current license,
it needs to make a round-trip to the kibana server. This refresh endpoint is provided
for when the client needs to check the license, but doesn't need to pull data from the
server for any reason, i.e., when adding a new watch.
*/


function registerRefreshRoute(deps) {
  deps.router.get({
    path: '/api/watcher/license/refresh',
    validate: false
  }, (0, _license_pre_routing_factory.licensePreRoutingFactory)(deps, (ctx, request, response) => {
    return response.ok({
      body: {
        success: true
      }
    });
  }));
}