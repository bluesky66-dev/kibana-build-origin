"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerMsearchRoute = registerMsearchRoute;

var _configSchema = require("@kbn/config-schema");

var _call_msearch = require("./call_msearch");

var _server = require("../../../../kibana_utils/server");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 * The msearch route takes in an array of searches, each consisting of header
 * and body json, and reformts them into a single request for the _msearch API.
 *
 * The reason for taking requests in a different format is so that we can
 * inject values into each request without needing to manually parse each one.
 *
 * This route is internal and _should not be used_ in any new areas of code.
 * It only exists as a means of removing remaining dependencies on the
 * legacy ES client.
 *
 * @deprecated
 */
function registerMsearchRoute(router, deps) {
  router.post({
    path: '/internal/_msearch',
    validate: {
      body: _configSchema.schema.object({
        searches: _configSchema.schema.arrayOf(_configSchema.schema.object({
          header: _configSchema.schema.object({
            index: _configSchema.schema.string(),
            preference: _configSchema.schema.maybe(_configSchema.schema.oneOf([_configSchema.schema.number(), _configSchema.schema.string()]))
          }, {
            unknowns: 'allow'
          }),
          body: _configSchema.schema.object({}, {
            unknowns: 'allow'
          })
        }))
      })
    }
  }, async (context, request, res) => {
    const callMsearch = (0, _call_msearch.getCallMsearch)({
      esClient: context.core.elasticsearch.client,
      globalConfig$: deps.globalConfig$,
      uiSettings: context.core.uiSettings.client
    });

    try {
      const response = await callMsearch({
        body: request.body
      });
      return res.ok(response);
    } catch (err) {
      return (0, _server.reportServerError)(res, err);
    }
  });
}