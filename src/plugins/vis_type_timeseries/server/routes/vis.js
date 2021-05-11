"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.visDataRoutes = void 0;

var _configSchema = require("@kbn/config-schema");

var _std = require("@kbn/std");

var _get_vis_data = require("../lib/get_vis_data");

var _vis_schema = require("../../common/vis_schema");

var _constants = require("../../common/constants");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const escapeHatch = _configSchema.schema.object({}, {
  unknowns: 'allow'
});

const visDataRoutes = (router, framework) => {
  router.post({
    path: _constants.ROUTES.VIS_DATA,
    validate: {
      body: escapeHatch
    }
  }, async (requestContext, request, response) => {
    try {
      (0, _std.ensureNoUnsafeProperties)(request.body);
    } catch (error) {
      return response.badRequest({
        body: error.message
      });
    }

    try {
      _vis_schema.visPayloadSchema.validate(request.body);
    } catch (error) {
      framework.logger.debug(`Request validation error: ${error.message}. This most likely means your TSVB visualization contains outdated configuration. You can report this problem under https://github.com/elastic/kibana/issues/new?template=Bug_report.md`);
    }

    try {
      const results = await (0, _get_vis_data.getVisData)(requestContext, request, framework);
      return response.ok({
        body: results
      });
    } catch (error) {
      return response.internalError({
        body: error.message
      });
    }
  });
};

exports.visDataRoutes = visDataRoutes;