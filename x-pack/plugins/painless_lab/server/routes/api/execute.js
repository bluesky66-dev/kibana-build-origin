"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerExecuteRoute = registerExecuteRoute;

var _configSchema = require("@kbn/config-schema");

var _constants = require("../../../common/constants");

var _shared_imports = require("../../shared_imports");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const bodySchema = _configSchema.schema.string();

function registerExecuteRoute({
  router,
  license
}) {
  router.post({
    path: `${_constants.API_BASE_PATH}/execute`,
    validate: {
      body: bodySchema
    }
  }, license.guardApiRoute(async (ctx, req, res) => {
    const body = req.body;

    try {
      const client = ctx.core.elasticsearch.client.asCurrentUser;
      const response = await client.scriptsPainlessExecute({
        body
      });
      return res.ok({
        body: response.body
      });
    } catch (error) {
      // Assume invalid painless script was submitted
      // Return 200 with error object
      const handleCustomError = () => {
        return res.ok({
          body: error.body
        });
      };

      return (0, _shared_imports.handleEsError)({
        error,
        response: res,
        handleCustomError
      });
    }
  }));
}