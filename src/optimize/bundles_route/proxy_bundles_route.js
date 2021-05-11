"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createProxyBundlesRoute = createProxyBundlesRoute;

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function createProxyBundlesRoute({
  host,
  port,
  buildHash
}) {
  return [buildProxyRouteForBundles(`/${buildHash}/bundles/`, host, port)];
}

function buildProxyRouteForBundles(routePath, host, port) {
  return {
    path: `${routePath}{path*}`,
    method: 'GET',
    handler: {
      proxy: {
        host,
        port,
        passThrough: true,
        xforward: true
      }
    },
    config: {
      auth: false
    }
  };
}