"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerTransformNodesRoutes = registerTransformNodesRoutes;
exports.isNodes = void 0;

var _object_utils = require("../../../common/utils/object_utils");

var _index = require("../index");

var _error_utils = require("./error_utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const NODE_ROLES = 'roles';

const isNodes = arg => {
  return (0, _object_utils.isPopulatedObject)(arg) && Object.values(arg).every(node => (0, _object_utils.isPopulatedObject)(node) && {}.hasOwnProperty.call(node, NODE_ROLES) && Array.isArray(node.roles));
};

exports.isNodes = isNodes;

function registerTransformNodesRoutes({
  router,
  license
}) {
  /**
   * @apiGroup Transform Nodes
   *
   * @api {get} /api/transforms/_nodes Transform Nodes
   * @apiName GetTransformNodes
   * @apiDescription Get transform nodes
   */
  router.get({
    path: (0, _index.addBasePath)('transforms/_nodes'),
    validate: false
  }, license.guardApiRoute(async (ctx, req, res) => {
    try {
      const {
        body: {
          nodes
        }
      } = await ctx.core.elasticsearch.client.asInternalUser.nodes.info({
        filter_path: `nodes.*.${NODE_ROLES}`
      });
      let count = 0;

      if (isNodes(nodes)) {
        for (const {
          roles
        } of Object.values(nodes)) {
          if (roles.includes('transform')) {
            count++;
          }
        }
      }

      return res.ok({
        body: {
          count
        }
      });
    } catch (e) {
      return res.customError((0, _error_utils.wrapError)((0, _error_utils.wrapEsError)(e)));
    }
  }));
}