"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initDeleteCommentApi = initDeleteCommentApi;

var _boom = _interopRequireDefault(require("@hapi/boom"));

var _configSchema = require("@kbn/config-schema");

var _saved_object_types = require("../../../../saved_object_types");

var _helpers = require("../../../../services/user_actions/helpers");

var _utils = require("../../utils");

var _constants = require("../../../../../common/constants");

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


function initDeleteCommentApi({
  caseService,
  router,
  userActionService,
  logger
}) {
  router.delete({
    path: _constants.CASE_COMMENT_DETAILS_URL,
    validate: {
      params: _configSchema.schema.object({
        case_id: _configSchema.schema.string(),
        comment_id: _configSchema.schema.string()
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
      const myComment = await caseService.getComment({
        client,
        commentId: request.params.comment_id
      });

      if (myComment == null) {
        throw _boom.default.notFound(`This comment ${request.params.comment_id} does not exist anymore.`);
      }

      const type = _saved_object_types.CASE_SAVED_OBJECT;
      const id = request.params.case_id;
      const caseRef = myComment.references.find(c => c.type === type);

      if (caseRef == null || caseRef != null && caseRef.id !== id) {
        throw _boom.default.notFound(`This comment ${request.params.comment_id} does not exist in ${id}).`);
      }

      await caseService.deleteComment({
        client,
        commentId: request.params.comment_id
      });
      await userActionService.postUserActions({
        client,
        actions: [(0, _helpers.buildCommentUserActionItem)({
          action: 'delete',
          actionAt: deleteDate,
          actionBy: {
            username,
            full_name,
            email
          },
          caseId: id,
          subCaseId: undefined,
          commentId: request.params.comment_id,
          fields: ['comment']
        })]
      });
      return response.noContent();
    } catch (error) {
      logger.error(`Failed to delete comment in route case id: ${request.params.case_id} comment id: ${request.params.comment_id}: ${error}`);
      return response.customError((0, _utils.wrapError)(error));
    }
  });
}