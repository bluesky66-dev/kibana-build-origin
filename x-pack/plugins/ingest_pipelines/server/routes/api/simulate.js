"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerSimulateRoute = void 0;

var _configSchema = require("@kbn/config-schema");

var _constants = require("../../../common/constants");

var _pipeline_schema = require("./pipeline_schema");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const bodySchema = _configSchema.schema.object({
  pipeline: _configSchema.schema.object(_pipeline_schema.pipelineSchema),
  documents: _configSchema.schema.arrayOf(_configSchema.schema.recordOf(_configSchema.schema.string(), _configSchema.schema.any())),
  verbose: _configSchema.schema.maybe(_configSchema.schema.boolean())
});

const registerSimulateRoute = ({
  router,
  license,
  lib: {
    isEsError
  }
}) => {
  router.post({
    path: `${_constants.API_BASE_PATH}/simulate`,
    validate: {
      body: bodySchema
    }
  }, license.guardApiRoute(async (ctx, req, res) => {
    const {
      callAsCurrentUser
    } = ctx.core.elasticsearch.legacy.client;
    const {
      pipeline,
      documents,
      verbose
    } = req.body;

    try {
      const response = await callAsCurrentUser('ingest.simulate', {
        verbose,
        body: {
          pipeline,
          docs: documents
        }
      });
      return res.ok({
        body: response
      });
    } catch (error) {
      if (isEsError(error)) {
        return res.customError({
          statusCode: error.statusCode,
          body: error
        });
      }

      return res.internalError({
        body: error
      });
    }
  }));
};

exports.registerSimulateRoute = registerSimulateRoute;