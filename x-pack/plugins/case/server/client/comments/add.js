"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addComment = void 0;

var _boom = _interopRequireDefault(require("@hapi/boom"));

var _pipeable = require("fp-ts/lib/pipeable");

var _Either = require("fp-ts/lib/Either");

var _function = require("fp-ts/lib/function");

var _utils = require("../../routes/api/utils");

var _api = require("../../../common/api");

var _helpers = require("../../services/user_actions/helpers");

var _common = require("../../common");

var _error = require("../../common/error");

var _saved_object_types = require("../../saved_object_types");

var _constants = require("../../../common/constants");

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


async function getSubCase({
  caseService,
  savedObjectsClient,
  caseId,
  createdAt,
  userActionService,
  user
}) {
  const mostRecentSubCase = await caseService.getMostRecentSubCase(savedObjectsClient, caseId);

  if (mostRecentSubCase && mostRecentSubCase.attributes.status !== _api.CaseStatuses.closed) {
    const subCaseAlertsAttachement = await caseService.getAllSubCaseComments({
      client: savedObjectsClient,
      id: mostRecentSubCase.id,
      options: {
        fields: [],
        filter: `${_saved_object_types.CASE_COMMENT_SAVED_OBJECT}.attributes.type: ${_api.CommentType.generatedAlert}`,
        page: 1,
        perPage: 1
      }
    });

    if (subCaseAlertsAttachement.total <= _constants.MAX_GENERATED_ALERTS_PER_SUB_CASE) {
      return mostRecentSubCase;
    }
  }

  const newSubCase = await caseService.createSubCase({
    client: savedObjectsClient,
    createdAt,
    caseId,
    createdBy: user
  });
  await userActionService.postUserActions({
    client: savedObjectsClient,
    actions: [(0, _helpers.buildCaseUserActionItem)({
      action: 'create',
      actionAt: createdAt,
      actionBy: user,
      caseId,
      subCaseId: newSubCase.id,
      fields: ['status', 'sub_case'],
      newValue: JSON.stringify({
        status: newSubCase.attributes.status
      })
    })]
  });
  return newSubCase;
}

const addGeneratedAlerts = async ({
  savedObjectsClient,
  caseService,
  userActionService,
  caseClient,
  caseId,
  comment,
  logger
}) => {
  const query = (0, _pipeable.pipe)(_api.AlertCommentRequestRt.decode(comment), (0, _Either.fold)((0, _api.throwErrors)(_boom.default.badRequest), _function.identity));
  (0, _utils.decodeCommentRequest)(comment); // This function only supports adding generated alerts

  if (comment.type !== _api.CommentType.generatedAlert) {
    throw _boom.default.internal('Attempting to add a non generated alert in the wrong context');
  }

  try {
    var _caseInfo$attributes$, _caseInfo$attributes$2, _caseInfo$attributes$3;

    const createdDate = new Date().toISOString();
    const caseInfo = await caseService.getCase({
      client: savedObjectsClient,
      id: caseId
    });

    if (query.type === _api.CommentType.generatedAlert && caseInfo.attributes.type !== _api.CaseType.collection) {
      throw _boom.default.badRequest('Sub case style alert comment cannot be added to an individual case');
    }

    const userDetails = {
      username: (_caseInfo$attributes$ = caseInfo.attributes.created_by) === null || _caseInfo$attributes$ === void 0 ? void 0 : _caseInfo$attributes$.username,
      full_name: (_caseInfo$attributes$2 = caseInfo.attributes.created_by) === null || _caseInfo$attributes$2 === void 0 ? void 0 : _caseInfo$attributes$2.full_name,
      email: (_caseInfo$attributes$3 = caseInfo.attributes.created_by) === null || _caseInfo$attributes$3 === void 0 ? void 0 : _caseInfo$attributes$3.email
    };
    const subCase = await getSubCase({
      caseService,
      savedObjectsClient,
      caseId,
      createdAt: createdDate,
      userActionService,
      user: userDetails
    });
    const commentableCase = new _common.CommentableCase({
      logger,
      collection: caseInfo,
      subCase,
      soClient: savedObjectsClient,
      service: caseService
    });
    const {
      comment: newComment,
      commentableCase: updatedCase
    } = await commentableCase.createComment({
      createdDate,
      user: userDetails,
      commentReq: query
    });

    if ((newComment.attributes.type === _api.CommentType.alert || newComment.attributes.type === _api.CommentType.generatedAlert) && caseInfo.attributes.settings.syncAlerts) {
      const alertsToUpdate = (0, _common.createAlertUpdateRequest)({
        comment: query,
        status: subCase.attributes.status
      });
      await caseClient.updateAlertsStatus({
        alerts: alertsToUpdate
      });
    }

    await userActionService.postUserActions({
      client: savedObjectsClient,
      actions: [(0, _helpers.buildCommentUserActionItem)({
        action: 'create',
        actionAt: createdDate,
        actionBy: { ...userDetails
        },
        caseId: updatedCase.caseId,
        subCaseId: updatedCase.subCaseId,
        commentId: newComment.id,
        fields: ['comment'],
        newValue: JSON.stringify(query)
      })]
    });
    return updatedCase.encode();
  } catch (error) {
    throw (0, _error.createCaseError)({
      message: `Failed while adding a generated alert to case id: ${caseId} error: ${error}`,
      error,
      logger
    });
  }
};

async function getCombinedCase({
  service,
  client,
  id,
  logger
}) {
  const [casePromise, subCasePromise] = await Promise.allSettled([service.getCase({
    client,
    id
  }), service.getSubCase({
    client,
    id
  })]);

  if (subCasePromise.status === 'fulfilled') {
    if (subCasePromise.value.references.length > 0) {
      const caseValue = await service.getCase({
        client,
        id: subCasePromise.value.references[0].id
      });
      return new _common.CommentableCase({
        logger,
        collection: caseValue,
        subCase: subCasePromise.value,
        service,
        soClient: client
      });
    } else {
      throw _boom.default.badRequest('Sub case found without reference to collection');
    }
  }

  if (casePromise.status === 'rejected') {
    throw casePromise.reason;
  } else {
    return new _common.CommentableCase({
      logger,
      collection: casePromise.value,
      service,
      soClient: client
    });
  }
}

const addComment = async ({
  savedObjectsClient,
  caseService,
  userActionService,
  caseClient,
  caseId,
  comment,
  user,
  logger
}) => {
  const query = (0, _pipeable.pipe)(_api.CommentRequestRt.decode(comment), (0, _Either.fold)((0, _api.throwErrors)(_boom.default.badRequest), _function.identity));

  if ((0, _utils.isCommentRequestTypeGenAlert)(comment)) {
    return addGeneratedAlerts({
      caseId,
      comment,
      caseClient,
      savedObjectsClient,
      userActionService,
      caseService,
      logger
    });
  }

  (0, _utils.decodeCommentRequest)(comment);

  try {
    const createdDate = new Date().toISOString();
    const combinedCase = await getCombinedCase({
      service: caseService,
      client: savedObjectsClient,
      id: caseId,
      logger
    }); // eslint-disable-next-line @typescript-eslint/naming-convention

    const {
      username,
      full_name,
      email
    } = user;
    const userInfo = {
      username,
      full_name,
      email
    };
    const {
      comment: newComment,
      commentableCase: updatedCase
    } = await combinedCase.createComment({
      createdDate,
      user: userInfo,
      commentReq: query
    });

    if (newComment.attributes.type === _api.CommentType.alert && updatedCase.settings.syncAlerts) {
      const alertsToUpdate = (0, _common.createAlertUpdateRequest)({
        comment: query,
        status: updatedCase.status
      });
      await caseClient.updateAlertsStatus({
        alerts: alertsToUpdate
      });
    }

    await userActionService.postUserActions({
      client: savedObjectsClient,
      actions: [(0, _helpers.buildCommentUserActionItem)({
        action: 'create',
        actionAt: createdDate,
        actionBy: {
          username,
          full_name,
          email
        },
        caseId: updatedCase.caseId,
        subCaseId: updatedCase.subCaseId,
        commentId: newComment.id,
        fields: ['comment'],
        newValue: JSON.stringify(query)
      })]
    });
    return updatedCase.encode();
  } catch (error) {
    throw (0, _error.createCaseError)({
      message: `Failed while adding a comment to case id: ${caseId} error: ${error}`,
      error,
      logger
    });
  }
};

exports.addComment = addComment;