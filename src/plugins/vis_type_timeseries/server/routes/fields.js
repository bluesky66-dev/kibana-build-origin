"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fieldsRoutes = void 0;

var _boom = require("@hapi/boom");

var _configSchema = require("@kbn/config-schema");

var _get_fields = require("../lib/get_fields");

var _constants = require("../../common/constants");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const fieldsRoutes = framework => {
  framework.router.get({
    path: _constants.ROUTES.FIELDS,
    validate: {
      query: _configSchema.schema.object({
        index: _configSchema.schema.string()
      })
    }
  }, async (context, req, res) => {
    try {
      return res.ok({
        body: await (0, _get_fields.getFields)(context, req, framework, req.query.index)
      });
    } catch (err) {
      if ((0, _boom.isBoom)(err) && err.output.statusCode === 401) {
        return res.customError({
          body: err.output.payload,
          statusCode: err.output.statusCode,
          headers: err.output.headers
        });
      }

      return res.ok({
        body: []
      });
    }
  });
};

exports.fieldsRoutes = fieldsRoutes;