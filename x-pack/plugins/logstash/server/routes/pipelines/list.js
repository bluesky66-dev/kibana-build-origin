"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerPipelinesListRoute = registerPipelinesListRoute;

var _i18n = require("@kbn/i18n");

var _server = require("../../../../licensing/server");

var _pipeline_list_item = require("../../models/pipeline_list_item");

var _check_license = require("../../lib/check_license");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function fetchPipelines(callWithRequest) {
  const params = {
    path: '/_logstash/pipeline',
    method: 'GET',
    ignore: [404]
  };
  return await callWithRequest('transport.request', params);
}

function registerPipelinesListRoute(router) {
  router.get({
    path: '/api/logstash/pipelines',
    validate: false
  }, (0, _server.wrapRouteWithLicenseCheck)(_check_license.checkLicense, router.handleLegacyErrors(async (context, request, response) => {
    try {
      const client = context.logstash.esClient;
      const pipelinesRecord = await fetchPipelines(client.callAsCurrentUser);
      const pipelines = Object.keys(pipelinesRecord).sort().map(key => {
        return _pipeline_list_item.PipelineListItem.fromUpstreamJSON(key, pipelinesRecord).downstreamJSON;
      });
      return response.ok({
        body: {
          pipelines
        }
      });
    } catch (err) {
      const statusCode = err.statusCode; // handles the permissions issue of Elasticsearch

      if (statusCode === 403) {
        return response.forbidden({
          body: _i18n.i18n.translate('xpack.logstash.insufficientUserPermissionsDescription', {
            defaultMessage: 'Insufficient user permissions for managing Logstash pipelines'
          })
        });
      }

      throw err;
    }
  })));
}