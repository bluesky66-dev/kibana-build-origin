"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initPostCommentApi = initPostCommentApi;

var _configSchema = require("@kbn/config-schema");

var _utils = require("../../utils");

var _constants = require("../../../../../common/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function initPostCommentApi({
  router,
  logger
}) {
  router.post({
    path: _constants.CASE_COMMENTS_URL,
    validate: {
      params: _configSchema.schema.object({
        case_id: _configSchema.schema.string()
      }),
      body: _utils.escapeHatch
    }
  }, async (context, request, response) => {
    if (!context.case) {
      return response.badRequest({
        body: 'RouteHandlerContext is not registered for cases'
      });
    }

    const caseClient = context.case.getCaseClient();
    const caseId = request.params.case_id;
    const comment = request.body;

    try {
      return response.ok({
        body: await caseClient.addComment({
          caseId,
          comment
        })
      });
    } catch (error) {
      logger.error(`Failed to post comment in route case id: ${request.params.case_id}: ${error}`);
      return response.customError((0, _utils.wrapError)(error));
    }
  });
}