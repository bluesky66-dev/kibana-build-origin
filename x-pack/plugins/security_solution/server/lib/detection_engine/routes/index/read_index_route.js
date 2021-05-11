"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.readIndexRoute = void 0;

var _constants = require("../../../../../common/constants");

var _utils = require("../utils");

var _get_index_exists = require("../../index/get_index_exists");

var _get_signals_template = require("./get_signals_template");

var _get_index_version = require("./get_index_version");

var _helpers = require("../../migrations/helpers");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const readIndexRoute = router => {
  router.get({
    path: _constants.DETECTION_ENGINE_INDEX_URL,
    validate: false,
    options: {
      tags: ['access:securitySolution']
    }
  }, async (context, request, response) => {
    const siemResponse = (0, _utils.buildSiemResponse)(response);

    try {
      var _context$securitySolu;

      const clusterClient = context.core.elasticsearch.legacy.client;
      const siemClient = (_context$securitySolu = context.securitySolution) === null || _context$securitySolu === void 0 ? void 0 : _context$securitySolu.getAppClient();

      if (!siemClient) {
        return siemResponse.error({
          statusCode: 404
        });
      }

      const index = siemClient.getSignalsIndex();
      const indexExists = await (0, _get_index_exists.getIndexExists)(clusterClient.callAsCurrentUser, index);

      if (indexExists) {
        let mappingOutdated = null;

        try {
          const indexVersion = await (0, _get_index_version.getIndexVersion)(clusterClient.callAsCurrentUser, index);
          mappingOutdated = (0, _helpers.isOutdated)({
            current: indexVersion,
            target: _get_signals_template.SIGNALS_TEMPLATE_VERSION
          });
        } catch (err) {
          const error = (0, _utils.transformError)(err); // Some users may not have the view_index_metadata permission necessary to check the index mapping version
          // so just continue and return null for index_mapping_outdated if the error is a 403

          if (error.statusCode !== 403) {
            return siemResponse.error({
              body: error.message,
              statusCode: error.statusCode
            });
          }
        }

        return response.ok({
          body: {
            name: index,
            index_mapping_outdated: mappingOutdated
          }
        });
      } else {
        return siemResponse.error({
          statusCode: 404,
          body: 'index for this space does not exist'
        });
      }
    } catch (err) {
      const error = (0, _utils.transformError)(err);
      return siemResponse.error({
        body: error.message,
        statusCode: error.statusCode
      });
    }
  });
};

exports.readIndexRoute = readIndexRoute;