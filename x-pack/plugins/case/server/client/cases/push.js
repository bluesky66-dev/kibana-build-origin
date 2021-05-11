"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.push = void 0;

var _boom = _interopRequireDefault(require("@hapi/boom"));

var _utils = require("../../routes/api/utils");

var _api = require("../../../common/api");

var _helpers = require("../../services/user_actions/helpers");

var _utils2 = require("./utils");

var _error = require("../../common/error");

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

/**
 * Returns true if the case should be closed based on the configuration settings and whether the case
 * is a collection. Collections are not closable because we aren't allowing their status to be changed.
 * In the future we could allow push to close all the sub cases of a collection but that's not currently supported.
 */


function shouldCloseByPush(configureSettings, caseInfo) {
  return configureSettings.total > 0 && configureSettings.saved_objects[0].attributes.closure_type === 'close-by-pushing' && caseInfo.attributes.type !== _api.CaseType.collection;
}

const push = async ({
  savedObjectsClient,
  caseService,
  caseConfigureService,
  userActionService,
  caseClient,
  actionsClient,
  connectorId,
  caseId,
  user,
  logger
}) => {
  var _theCase, _theCase2, _connector$id, _connector, _updatedCase;
  /* Start of push to external service */


  let theCase;
  let connector;
  let userActions;
  let alerts;
  let connectorMappings;
  let externalServiceIncident;

  try {
    [theCase, connector, userActions] = await Promise.all([caseClient.get({
      id: caseId,
      includeComments: true,
      includeSubCaseComments: true
    }), actionsClient.get({
      id: connectorId
    }), caseClient.getUserActions({
      caseId
    })]);
  } catch (e) {
    const message = `Error getting case and/or connector and/or user actions: ${e.message}`;
    throw (0, _error.createCaseError)({
      message,
      error: e,
      logger
    });
  } // We need to change the logic when we support subcases


  if (((_theCase = theCase) === null || _theCase === void 0 ? void 0 : _theCase.status) === _api.CaseStatuses.closed) {
    throw _boom.default.conflict(`This case ${theCase.title} is closed. You can not pushed if the case is closed.`);
  }

  const alertsInfo = (0, _utils.getAlertInfoFromComments)((_theCase2 = theCase) === null || _theCase2 === void 0 ? void 0 : _theCase2.comments);

  try {
    alerts = await caseClient.getAlerts({
      alertsInfo
    });
  } catch (e) {
    throw (0, _error.createCaseError)({
      message: `Error getting alerts for case with id ${theCase.id}: ${e.message}`,
      logger,
      error: e
    });
  }

  try {
    connectorMappings = await caseClient.getMappings({
      actionsClient,
      connectorId: connector.id,
      connectorType: connector.actionTypeId
    });
  } catch (e) {
    const message = `Error getting mapping for connector with id ${connector.id}: ${e.message}`;
    throw (0, _error.createCaseError)({
      message,
      error: e,
      logger
    });
  }

  try {
    externalServiceIncident = await (0, _utils2.createIncident)({
      actionsClient,
      theCase,
      userActions,
      connector: connector,
      mappings: connectorMappings,
      alerts
    });
  } catch (e) {
    const message = `Error creating incident for case with id ${theCase.id}: ${e.message}`;
    throw (0, _error.createCaseError)({
      error: e,
      message,
      logger
    });
  }

  const pushRes = await actionsClient.execute({
    actionId: (_connector$id = (_connector = connector) === null || _connector === void 0 ? void 0 : _connector.id) !== null && _connector$id !== void 0 ? _connector$id : '',
    params: {
      subAction: 'pushToService',
      subActionParams: externalServiceIncident
    }
  });

  if (pushRes.status === 'error') {
    var _ref, _pushRes$serviceMessa;

    throw _boom.default.failedDependency((_ref = (_pushRes$serviceMessa = pushRes.serviceMessage) !== null && _pushRes$serviceMessa !== void 0 ? _pushRes$serviceMessa : pushRes.message) !== null && _ref !== void 0 ? _ref : 'Error pushing to service');
  }
  /* End of push to external service */

  /* Start of update case with push information */


  let myCase;
  let myCaseConfigure;
  let comments;

  try {
    var _theCase$totalComment, _theCase3;

    [myCase, myCaseConfigure, comments] = await Promise.all([caseService.getCase({
      client: savedObjectsClient,
      id: caseId
    }), caseConfigureService.find({
      client: savedObjectsClient
    }), caseService.getAllCaseComments({
      client: savedObjectsClient,
      id: caseId,
      options: {
        fields: [],
        page: 1,
        perPage: (_theCase$totalComment = (_theCase3 = theCase) === null || _theCase3 === void 0 ? void 0 : _theCase3.totalComment) !== null && _theCase$totalComment !== void 0 ? _theCase$totalComment : 0
      },
      includeSubCaseComments: true
    })]);
  } catch (e) {
    const message = `Error getting user and/or case and/or case configuration and/or case comments: ${e.message}`;
    throw (0, _error.createCaseError)({
      error: e,
      message,
      logger
    });
  } // eslint-disable-next-line @typescript-eslint/naming-convention


  const {
    username,
    full_name,
    email
  } = user;
  const pushedDate = new Date().toISOString();
  const externalServiceResponse = pushRes.data;
  const externalService = {
    pushed_at: pushedDate,
    pushed_by: {
      username,
      full_name,
      email
    },
    connector_id: connector.id,
    connector_name: connector.name,
    external_id: externalServiceResponse.id,
    external_title: externalServiceResponse.title,
    external_url: externalServiceResponse.url
  };
  let updatedCase;
  let updatedComments;
  const shouldMarkAsClosed = shouldCloseByPush(myCaseConfigure, myCase);

  try {
    [updatedCase, updatedComments] = await Promise.all([caseService.patchCase({
      client: savedObjectsClient,
      caseId,
      updatedAttributes: { ...(shouldMarkAsClosed ? {
          status: _api.CaseStatuses.closed,
          closed_at: pushedDate,
          closed_by: {
            email,
            full_name,
            username
          }
        } : {}),
        external_service: externalService,
        updated_at: pushedDate,
        updated_by: {
          username,
          full_name,
          email
        }
      },
      version: myCase.version
    }), caseService.patchComments({
      client: savedObjectsClient,
      comments: comments.saved_objects.filter(comment => comment.attributes.pushed_at == null).map(comment => ({
        commentId: comment.id,
        updatedAttributes: {
          pushed_at: pushedDate,
          pushed_by: {
            username,
            full_name,
            email
          }
        },
        version: comment.version
      }))
    }), userActionService.postUserActions({
      client: savedObjectsClient,
      actions: [...(shouldMarkAsClosed ? [(0, _helpers.buildCaseUserActionItem)({
        action: 'update',
        actionAt: pushedDate,
        actionBy: {
          username,
          full_name,
          email
        },
        caseId,
        fields: ['status'],
        newValue: _api.CaseStatuses.closed,
        oldValue: myCase.attributes.status
      })] : []), (0, _helpers.buildCaseUserActionItem)({
        action: 'push-to-service',
        actionAt: pushedDate,
        actionBy: {
          username,
          full_name,
          email
        },
        caseId,
        fields: ['pushed'],
        newValue: JSON.stringify(externalService)
      })]
    })]);
  } catch (e) {
    const message = `Error updating case and/or comments and/or creating user action: ${e.message}`;
    throw (0, _error.createCaseError)({
      error: e,
      message,
      logger
    });
  }
  /* End of update case with push information */


  return _api.CaseResponseRt.encode((0, _utils.flattenCaseSavedObject)({
    savedObject: { ...myCase,
      ...updatedCase,
      attributes: { ...myCase.attributes,
        ...((_updatedCase = updatedCase) === null || _updatedCase === void 0 ? void 0 : _updatedCase.attributes)
      },
      references: myCase.references
    },
    comments: comments.saved_objects.map(origComment => {
      var _updatedComment$versi, _origComment$referenc;

      const updatedComment = updatedComments.saved_objects.find(c => c.id === origComment.id);
      return { ...origComment,
        ...updatedComment,
        attributes: { ...origComment.attributes,
          ...(updatedComment === null || updatedComment === void 0 ? void 0 : updatedComment.attributes),
          ...(0, _utils2.getCommentContextFromAttributes)(origComment.attributes)
        },
        version: (_updatedComment$versi = updatedComment === null || updatedComment === void 0 ? void 0 : updatedComment.version) !== null && _updatedComment$versi !== void 0 ? _updatedComment$versi : origComment.version,
        references: (_origComment$referenc = origComment === null || origComment === void 0 ? void 0 : origComment.references) !== null && _origComment$referenc !== void 0 ? _origComment$referenc : []
      };
    })
  }));
};

exports.push = push;