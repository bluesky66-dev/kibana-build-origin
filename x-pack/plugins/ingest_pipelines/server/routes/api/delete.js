"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerDeleteRoute = void 0;

var _configSchema = require("@kbn/config-schema");

var _constants = require("../../../common/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const paramsSchema = _configSchema.schema.object({
  names: _configSchema.schema.string()
});

const registerDeleteRoute = ({
  router,
  license
}) => {
  router.delete({
    path: `${_constants.API_BASE_PATH}/{names}`,
    validate: {
      params: paramsSchema
    }
  }, license.guardApiRoute(async (ctx, req, res) => {
    const {
      callAsCurrentUser
    } = ctx.core.elasticsearch.legacy.client;
    const {
      names
    } = req.params;
    const pipelineNames = names.split(',');
    const response = {
      itemsDeleted: [],
      errors: []
    };
    await Promise.all(pipelineNames.map(pipelineName => {
      return callAsCurrentUser('ingest.deletePipeline', {
        id: pipelineName
      }).then(() => response.itemsDeleted.push(pipelineName)).catch(e => response.errors.push({
        name: pipelineName,
        error: e
      }));
    }));
    return res.ok({
      body: response
    });
  }));
};

exports.registerDeleteRoute = registerDeleteRoute;