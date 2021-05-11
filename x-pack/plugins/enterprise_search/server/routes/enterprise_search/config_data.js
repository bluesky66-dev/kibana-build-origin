"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerConfigDataRoute = registerConfigDataRoute;

var _enterprise_search_config_api = require("../../lib/enterprise_search_config_api");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function registerConfigDataRoute({
  router,
  config,
  log
}) {
  router.get({
    path: '/api/enterprise_search/config_data',
    validate: false
  }, async (context, request, response) => {
    const data = await (0, _enterprise_search_config_api.callEnterpriseSearchConfigAPI)({
      request,
      config,
      log
    });

    if (!Object.keys(data).length) {
      return response.customError({
        statusCode: 502,
        body: 'Error fetching data from Enterprise Search'
      });
    } else {
      return response.ok({
        body: data,
        headers: {
          'content-type': 'application/json'
        }
      });
    }
  });
}