"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deleteIndexRoute = void 0;

var _constants = require("../../../../../common/constants");

var _utils = require("../utils");

var _get_index_exists = require("../../index/get_index_exists");

var _get_policy_exists = require("../../index/get_policy_exists");

var _delete_policy = require("../../index/delete_policy");

var _get_template_exists = require("../../index/get_template_exists");

var _delete_all_index = require("../../index/delete_all_index");

var _delete_template = require("../../index/delete_template");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Deletes all of the indexes, template, ilm policies, and aliases. You can check
 * this by looking at each of these settings from ES after a deletion:
 * GET /_template/.siem-signals-default
 * GET /.siem-signals-default-000001/
 * GET /_ilm/policy/.signals-default
 * GET /_alias/.siem-signals-default
 *
 * And ensuring they're all gone
 */


const deleteIndexRoute = router => {
  router.delete({
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

      const callCluster = clusterClient.callAsCurrentUser;
      const index = siemClient.getSignalsIndex();
      const indexExists = await (0, _get_index_exists.getIndexExists)(callCluster, index);

      if (!indexExists) {
        return siemResponse.error({
          statusCode: 404,
          body: `index: "${index}" does not exist`
        });
      } else {
        await (0, _delete_all_index.deleteAllIndex)(callCluster, `${index}-*`);
        const policyExists = await (0, _get_policy_exists.getPolicyExists)(callCluster, index);

        if (policyExists) {
          await (0, _delete_policy.deletePolicy)(callCluster, index);
        }

        const templateExists = await (0, _get_template_exists.getTemplateExists)(callCluster, index);

        if (templateExists) {
          await (0, _delete_template.deleteTemplate)(callCluster, index);
        }

        return response.ok({
          body: {
            acknowledged: true
          }
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

exports.deleteIndexRoute = deleteIndexRoute;