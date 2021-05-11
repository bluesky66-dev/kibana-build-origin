"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initDeleteAllCommentsApi = initDeleteAllCommentsApi;

var _configSchema = require("@kbn/config-schema");

var _helpers = require("../../../../services/user_actions/helpers");

var _utils = require("../../utils");

var _constants = require("../../../../../common/constants");

var _api = require("../../../../../common/api");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function initDeleteAllCommentsApi({
  caseService,
  router,
  userActionService,
  logger
}) {
  router.delete({
    path: _constants.CASE_COMMENTS_URL,
    validate: {
      params: _configSchema.schema.object({
        case_id: _configSchema.schema.string()
      })
    }
  }, async (context, request, response) => {
    try {
      const client = context.core.savedObjects.client; // eslint-disable-next-line @typescript-eslint/naming-convention

      const {
        username,
        full_name,
        email
      } = await caseService.getUser({
        request
      });
      const deleteDate = new Date().toISOString();
      const id = request.params.case_id;
      const comments = await caseService.getCommentsByAssociation({
        client,
        id,
        associationType: _api.AssociationType.case
      });
      await Promise.all(comments.saved_objects.map(comment => caseService.deleteComment({
        client,
        commentId: comment.id
      })));
      await userActionService.postUserActions({
        client,
        actions: comments.saved_objects.map(comment => (0, _helpers.buildCommentUserActionItem)({
          action: 'delete',
          actionAt: deleteDate,
          actionBy: {
            username,
            full_name,
            email
          },
          caseId: request.params.case_id,
          subCaseId: undefined,
          commentId: comment.id,
          fields: ['comment']
        }))
      });
      return response.noContent();
    } catch (error) {
      logger.error(`Failed to delete all comments in route case id: ${request.params.case_id}: ${error}`);
      return response.customError((0, _utils.wrapError)(error));
    }
  });
}