"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initGetCommentApi = initGetCommentApi;

var _configSchema = require("@kbn/config-schema");

var _api = require("../../../../../common/api");

var _utils = require("../../utils");

var _constants = require("../../../../../common/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function initGetCommentApi({
  caseService,
  router,
  logger
}) {
  router.get({
    path: _constants.CASE_COMMENT_DETAILS_URL,
    validate: {
      params: _configSchema.schema.object({
        case_id: _configSchema.schema.string(),
        comment_id: _configSchema.schema.string()
      })
    }
  }, async (context, request, response) => {
    try {
      const client = context.core.savedObjects.client;
      const comment = await caseService.getComment({
        client,
        commentId: request.params.comment_id
      });
      return response.ok({
        body: _api.CommentResponseRt.encode((0, _utils.flattenCommentSavedObject)(comment))
      });
    } catch (error) {
      logger.error(`Failed to get comment in route case id: ${request.params.case_id} comment id: ${request.params.comment_id}: ${error}`);
      return response.customError((0, _utils.wrapError)(error));
    }
  });
}