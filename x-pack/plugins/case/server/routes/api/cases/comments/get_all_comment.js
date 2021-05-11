"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initGetAllCommentsApi = initGetAllCommentsApi;

var _configSchema = require("@kbn/config-schema");

var _api = require("../../../../../common/api");

var _utils = require("../../utils");

var _constants = require("../../../../../common/constants");

var _common = require("../../../../common");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function initGetAllCommentsApi({
  caseService,
  router,
  logger
}) {
  router.get({
    path: _constants.CASE_COMMENTS_URL,
    validate: {
      params: _configSchema.schema.object({
        case_id: _configSchema.schema.string()
      })
    }
  }, async (context, request, response) => {
    try {
      const client = context.core.savedObjects.client;
      const comments = await caseService.getAllCaseComments({
        client,
        id: request.params.case_id,
        includeSubCaseComments: false,
        options: {
          sortField: _common.defaultSortField
        }
      });
      return response.ok({
        body: _api.AllCommentsResponseRt.encode((0, _utils.flattenCommentSavedObjects)(comments.saved_objects))
      });
    } catch (error) {
      logger.error(`Failed to get all comments in route case id: ${request.params.case_id}: ${error}`);
      return response.customError((0, _utils.wrapError)(error));
    }
  });
}