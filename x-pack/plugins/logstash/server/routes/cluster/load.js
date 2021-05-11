"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerClusterLoadRoute = registerClusterLoadRoute;

var _server = require("../../../../licensing/server");

var _cluster = require("../../models/cluster");

var _check_license = require("../../lib/check_license");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function registerClusterLoadRoute(router) {
  router.get({
    path: '/api/logstash/cluster',
    validate: false
  }, (0, _server.wrapRouteWithLicenseCheck)(_check_license.checkLicense, async (context, request, response) => {
    try {
      const client = context.logstash.esClient;
      const info = await client.callAsCurrentUser('info');
      return response.ok({
        body: {
          cluster: _cluster.Cluster.fromUpstreamJSON(info).downstreamJSON
        }
      });
    } catch (err) {
      if (err.status === 403) {
        return response.ok();
      }

      return response.internalError();
    }
  }));
}