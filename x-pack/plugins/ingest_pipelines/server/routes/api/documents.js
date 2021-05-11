"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerDocumentsRoute = void 0;

var _configSchema = require("@kbn/config-schema");

var _constants = require("../../../common/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const paramsSchema = _configSchema.schema.object({
  index: _configSchema.schema.string(),
  id: _configSchema.schema.string()
});

const registerDocumentsRoute = ({
  router,
  license,
  lib: {
    isEsError
  }
}) => {
  router.get({
    path: `${_constants.API_BASE_PATH}/documents/{index}/{id}`,
    validate: {
      params: paramsSchema
    }
  }, license.guardApiRoute(async (ctx, req, res) => {
    const {
      callAsCurrentUser
    } = ctx.core.elasticsearch.legacy.client;
    const {
      index,
      id
    } = req.params;

    try {
      const document = await callAsCurrentUser('get', {
        index,
        id
      });
      const {
        _id,
        _index,
        _source
      } = document;
      return res.ok({
        body: {
          _id,
          _index,
          _source
        }
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

exports.registerDocumentsRoute = registerDocumentsRoute;