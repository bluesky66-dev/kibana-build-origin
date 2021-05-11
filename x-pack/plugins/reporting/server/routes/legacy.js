"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerLegacy = registerLegacy;

var _configSchema = require("@kbn/config-schema");

var _querystring = _interopRequireDefault(require("querystring"));

var _authorized_user_pre_routing = require("./lib/authorized_user_pre_routing");

var _constants = require("../../common/constants");

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const BASE_GENERATE = `${_constants.API_BASE_URL}/generate`;

function registerLegacy(reporting, handler, handleError, logger) {
  const {
    router
  } = reporting.getPluginSetupDeps();
  const userHandler = (0, _authorized_user_pre_routing.authorizedUserPreRoutingFactory)(reporting);

  function createLegacyPdfRoute({
    path,
    objectType
  }) {
    const exportTypeId = 'printablePdf';
    router.post({
      path,
      validate: {
        params: _configSchema.schema.object({
          savedObjectId: _configSchema.schema.string({
            minLength: 3
          })
        }),
        query: _configSchema.schema.any()
      }
    }, userHandler(async (user, context, req, res) => {
      const message = `The following URL is deprecated and will stop working in the next major version: ${req.url.pathname}${req.url.search}`;
      logger.warn(message, ['deprecation']);

      try {
        const {
          title,
          savedObjectId,
          browserTimezone
        } = req.params;

        const queryString = _querystring.default.stringify(req.query);

        return await handler(user, exportTypeId, {
          title,
          objectType,
          savedObjectId,
          browserTimezone,
          queryString
        }, context, req, res);
      } catch (err) {
        throw handleError(res, err);
      }
    }));
  }

  createLegacyPdfRoute({
    path: `${BASE_GENERATE}/visualization/{savedId}`,
    objectType: 'visualization'
  });
  createLegacyPdfRoute({
    path: `${BASE_GENERATE}/search/{savedId}`,
    objectType: 'search'
  });
  createLegacyPdfRoute({
    path: `${BASE_GENERATE}/dashboard/{savedId}`,
    objectType: 'dashboard'
  });
}