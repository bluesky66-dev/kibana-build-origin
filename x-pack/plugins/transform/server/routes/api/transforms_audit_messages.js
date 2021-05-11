"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerTransformsAuditMessagesRoutes = registerTransformsAuditMessagesRoutes;

var _common = require("../../../common/api_schemas/common");

var _index = require("../index");

var _error_utils = require("./error_utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const ML_DF_NOTIFICATION_INDEX_PATTERN = '.transform-notifications-read';
const SIZE = 500;

function registerTransformsAuditMessagesRoutes({
  router,
  license
}) {
  /**
   * @apiGroup Transforms Audit Messages
   *
   * @api {get} /api/transform/transforms/:transformId/messages Transforms Messages
   * @apiName GetTransformsMessages
   * @apiDescription Get transforms audit messages
   *
   * @apiSchema (params) transformIdParamSchema
   */
  router.get({
    path: (0, _index.addBasePath)('transforms/{transformId}/messages'),
    validate: {
      params: _common.transformIdParamSchema
    }
  }, license.guardApiRoute(async (ctx, req, res) => {
    const {
      transformId
    } = req.params; // search for audit messages,
    // transformId is optional. without it, all transforms will be listed.

    const query = {
      bool: {
        filter: [{
          bool: {
            must_not: {
              term: {
                level: 'activity'
              }
            }
          }
        }]
      }
    }; // if no transformId specified, load all of the messages

    if (transformId !== undefined) {
      query.bool.filter.push({
        bool: {
          should: [{
            term: {
              transform_id: '' // catch system messages

            }
          }, {
            term: {
              transform_id: transformId // messages for specified transformId

            }
          }]
        }
      });
    }

    try {
      const {
        body: resp
      } = await ctx.core.elasticsearch.client.asCurrentUser.search({
        index: ML_DF_NOTIFICATION_INDEX_PATTERN,
        ignore_unavailable: true,
        size: SIZE,
        body: {
          sort: [{
            timestamp: {
              order: 'desc'
            }
          }, {
            transform_id: {
              order: 'asc'
            }
          }],
          query
        }
      });
      let messages = [];

      if (resp.hits.total.value > 0) {
        messages = resp.hits.hits.map(hit => hit._source);
        messages.reverse();
      }

      return res.ok({
        body: messages
      });
    } catch (e) {
      return res.customError((0, _error_utils.wrapError)((0, _error_utils.wrapEsError)(e)));
    }
  }));
}