"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initPatchCommentApi = initPatchCommentApi;

var _fp = require("lodash/fp");

var _pipeable = require("fp-ts/lib/pipeable");

var _Either = require("fp-ts/lib/Either");

var _function = require("fp-ts/lib/function");

var _configSchema = require("@kbn/config-schema");

var _boom = _interopRequireDefault(require("@hapi/boom"));

var _common = require("../../../../common");

var _api = require("../../../../../common/api");

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


async function getCommentableCase({
  service,
  client,
  caseID,
  subCaseId,
  logger
}) {
  if (subCaseId) {
    const [caseInfo, subCase] = await Promise.all([service.getCase({
      client,
      id: caseID
    }), service.getSubCase({
      client,
      id: subCaseId
    })]);
    return new _common.CommentableCase({
      collection: caseInfo,
      service,
      subCase,
      soClient: client,
      logger
    });
  } else {
    const caseInfo = await service.getCase({
      client,
      id: caseID
    });
    return new _common.CommentableCase({
      collection: caseInfo,
      service,
      soClient: client,
      logger
    });
  }
}

function initPatchCommentApi({
  caseService,
  router,
  userActionService,
  logger
}) {
  router.patch({
    path: _constants.CASE_COMMENTS_URL,
    validate: {
      params: _configSchema.schema.object({
        case_id: _configSchema.schema.string()
      }),
      body: _utils.escapeHatch
    }
  }, async (context, request, response) => {
    try {
      const client = context.core.savedObjects.client;
      const query = (0, _pipeable.pipe)(_api.CommentPatchRequestRt.decode(request.body), (0, _Either.fold)((0, _api.throwErrors)(_boom.default.badRequest), _function.identity));
      const {
        id: queryCommentId,
        version: queryCommentVersion,
        ...queryRestAttributes
      } = query;
      (0, _utils.decodeCommentRequest)(queryRestAttributes);
      const commentableCase = await getCommentableCase({
        service: caseService,
        client,
        caseID: request.params.case_id,
        subCaseId: undefined,
        logger
      });
      const myComment = await caseService.getComment({
        client,
        commentId: queryCommentId
      });

      if (myComment == null) {
        throw _boom.default.notFound(`This comment ${queryCommentId} does not exist anymore.`);
      }

      if (myComment.attributes.type !== queryRestAttributes.type) {
        throw _boom.default.badRequest(`You cannot change the type of the comment.`);
      }

      const saveObjType = _saved_object_types.CASE_SAVED_OBJECT;
      const caseRef = myComment.references.find(c => c.type === saveObjType);

      if (caseRef == null || caseRef != null && caseRef.id !== commentableCase.id) {
        throw _boom.default.notFound(`This comment ${queryCommentId} does not exist in ${commentableCase.id}).`);
      }

      if (queryCommentVersion !== myComment.version) {
        throw _boom.default.conflict('This case has been updated. Please refresh before saving additional updates.');
      } // eslint-disable-next-line @typescript-eslint/naming-convention


      const {
        username,
        full_name,
        email
      } = await caseService.getUser({
        request
      });
      const userInfo = {
        username,
        full_name,
        email
      };
      const updatedDate = new Date().toISOString();
      const {
        comment: updatedComment,
        commentableCase: updatedCase
      } = await commentableCase.updateComment({
        updateRequest: query,
        updatedAt: updatedDate,
        user: userInfo
      });
      await userActionService.postUserActions({
        client,
        actions: [(0, _helpers.buildCommentUserActionItem)({
          action: 'update',
          actionAt: updatedDate,
          actionBy: {
            username,
            full_name,
            email
          },
          caseId: request.params.case_id,
          subCaseId: undefined,
          commentId: updatedComment.id,
          fields: ['comment'],
          newValue: JSON.stringify(queryRestAttributes),
          oldValue: JSON.stringify( // We are interested only in ContextBasicRt attributes
          // myComment.attribute contains also CommentAttributesBasicRt attributes
          (0, _fp.pick)(Object.keys(queryRestAttributes), myComment.attributes))
        })]
      });
      return response.ok({
        body: await updatedCase.encode()
      });
    } catch (error) {
      logger.error(`Failed to patch comment in route case id: ${request.params.case_id}: ${error}`);
      return response.customError((0, _utils.wrapError)(error));
    }
  });
}