"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCommentContextFromAttributes = exports.isCommentAlertType = exports.transformComments = exports.transformFields = exports.prepareFieldsForTransformation = exports.transformers = exports.FIELD_INFORMATION = exports.getEntity = exports.createIncident = exports.getLatestPushInfo = void 0;

var _i18n = require("@kbn/i18n");

var _lodash = require("lodash");

var _api = require("../../../common/api");

var _connectors = require("../../connectors");

var _utils = require("../../routes/api/utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const getLatestPushInfo = (connectorId, userActions) => {
  for (const [index, action] of [...userActions].reverse().entries()) {
    if (action.action === 'push-to-service' && action.new_value) try {
      const pushedInfo = JSON.parse(action.new_value);

      if (pushedInfo.connector_id === connectorId) {
        // We returned the index of the element in the userActions array.
        // As we traverse the userActions in reverse we need to calculate the index of a normal traversal
        return {
          index: userActions.length - index - 1,
          pushedInfo
        };
      }
    } catch (e) {// Silence JSON parse errors
    }
  }

  return null;
};

exports.getLatestPushInfo = getLatestPushInfo;

const isConnectorSupported = connectorId => Object.values(_api.ConnectorTypes).includes(connectorId);

const getCommentContent = comment => {
  if (comment.type === _api.CommentType.user) {
    return comment.comment;
  } else if (comment.type === _api.CommentType.alert || comment.type === _api.CommentType.generatedAlert) {
    const ids = (0, _utils.getAlertIds)(comment);
    return `Alert with ids ${ids.join(', ')} added to case`;
  }

  return '';
};

const countAlerts = comments => {
  var _comments$reduce;

  return (_comments$reduce = comments === null || comments === void 0 ? void 0 : comments.reduce((total, comment) => {
    if (comment.type === _api.CommentType.alert || comment.type === _api.CommentType.generatedAlert) {
      return total + (Array.isArray(comment.alertId) ? comment.alertId.length : 1);
    }

    return total;
  }, 0)) !== null && _comments$reduce !== void 0 ? _comments$reduce : 0;
};

const createIncident = async ({
  actionsClient,
  theCase,
  userActions,
  connector,
  mappings,
  alerts
}) => {
  var _latestPushInfo$pushe, _latestPushInfo$pushe2, _latestPushInfo$index;

  const {
    comments: caseComments,
    title,
    description,
    created_at: createdAt,
    created_by: createdBy,
    updated_at: updatedAt,
    updated_by: updatedBy
  } = theCase;

  if (!isConnectorSupported(connector.actionTypeId)) {
    throw new Error('Invalid external service');
  }

  const params = {
    title,
    description,
    createdAt,
    createdBy,
    updatedAt,
    updatedBy
  };
  const latestPushInfo = getLatestPushInfo(connector.id, userActions);
  const externalId = (_latestPushInfo$pushe = latestPushInfo === null || latestPushInfo === void 0 ? void 0 : (_latestPushInfo$pushe2 = latestPushInfo.pushedInfo) === null || _latestPushInfo$pushe2 === void 0 ? void 0 : _latestPushInfo$pushe2.external_id) !== null && _latestPushInfo$pushe !== void 0 ? _latestPushInfo$pushe : null;
  const defaultPipes = externalId ? ['informationUpdated'] : ['informationCreated'];
  let currentIncident;

  const externalServiceFields = _connectors.externalServiceFormatters[connector.actionTypeId].format(theCase, alerts);

  let incident = { ...externalServiceFields
  };

  if (externalId) {
    try {
      currentIncident = await actionsClient.execute({
        actionId: connector.id,
        params: {
          subAction: 'getIncident',
          subActionParams: {
            externalId
          }
        }
      });
    } catch (ex) {
      throw new Error(`Retrieving Incident by id ${externalId} from ${connector.actionTypeId} failed with exception: ${ex}`);
    }
  }

  const fields = prepareFieldsForTransformation({
    defaultPipes,
    mappings,
    params
  });
  const transformedFields = transformFields({
    params,
    fields,
    currentIncident
  });
  incident = { ...incident,
    ...transformedFields,
    externalId
  };
  const commentsIdsToBeUpdated = new Set(userActions.slice((_latestPushInfo$index = latestPushInfo === null || latestPushInfo === void 0 ? void 0 : latestPushInfo.index) !== null && _latestPushInfo$index !== void 0 ? _latestPushInfo$index : 0).filter(action => Array.isArray(action.action_field) && action.action_field[0] === 'comment').map(action => action.comment_id));
  const commentsToBeUpdated = caseComments === null || caseComments === void 0 ? void 0 : caseComments.filter(comment => // We push only user's comments
  comment.type === _api.CommentType.user && commentsIdsToBeUpdated.has(comment.id));
  const totalAlerts = countAlerts(caseComments);
  let comments = [];

  if (commentsToBeUpdated && Array.isArray(commentsToBeUpdated) && commentsToBeUpdated.length > 0) {
    const commentsMapping = mappings.find(m => m.source === 'comments');

    if ((commentsMapping === null || commentsMapping === void 0 ? void 0 : commentsMapping.action_type) !== 'nothing') {
      comments = transformComments(commentsToBeUpdated, ['informationAdded']);
    }
  }

  if (totalAlerts > 0) {
    comments.push({
      comment: `Elastic Security Alerts attached to the case: ${totalAlerts}`,
      commentId: `${theCase.id}-total-alerts`
    });
  }

  return {
    incident,
    comments
  };
};

exports.createIncident = createIncident;

const getEntity = entity => {
  var _ref;

  return (_ref = entity.updatedBy != null ? entity.updatedBy.full_name ? entity.updatedBy.full_name : entity.updatedBy.username : entity.createdBy != null ? entity.createdBy.full_name ? entity.createdBy.full_name : entity.createdBy.username : '') !== null && _ref !== void 0 ? _ref : '';
};

exports.getEntity = getEntity;

const FIELD_INFORMATION = (mode, date, user) => {
  switch (mode) {
    case 'create':
      return _i18n.i18n.translate('xpack.case.connectors.case.externalIncidentCreated', {
        values: {
          date,
          user
        },
        defaultMessage: '(created at {date} by {user})'
      });

    case 'update':
      return _i18n.i18n.translate('xpack.case.connectors.case.externalIncidentUpdated', {
        values: {
          date,
          user
        },
        defaultMessage: '(updated at {date} by {user})'
      });

    case 'add':
      return _i18n.i18n.translate('xpack.case.connectors.case.externalIncidentAdded', {
        values: {
          date,
          user
        },
        defaultMessage: '(added at {date} by {user})'
      });

    default:
      return _i18n.i18n.translate('xpack.case.connectors.case.externalIncidentDefault', {
        values: {
          date,
          user
        },
        defaultMessage: '(created at {date} by {user})'
      });
  }
};

exports.FIELD_INFORMATION = FIELD_INFORMATION;
const transformers = {
  informationCreated: ({
    value,
    date,
    user,
    ...rest
  }) => ({
    value: `${value} ${FIELD_INFORMATION('create', date, user)}`,
    ...rest
  }),
  informationUpdated: ({
    value,
    date,
    user,
    ...rest
  }) => ({
    value: `${value} ${FIELD_INFORMATION('update', date, user)}`,
    ...rest
  }),
  informationAdded: ({
    value,
    date,
    user,
    ...rest
  }) => ({
    value: `${value} ${FIELD_INFORMATION('add', date, user)}`,
    ...rest
  }),
  append: ({
    value,
    previousValue,
    ...rest
  }) => ({
    value: previousValue ? `${previousValue} \r\n${value}` : `${value}`,
    ...rest
  })
};
exports.transformers = transformers;

const prepareFieldsForTransformation = ({
  defaultPipes,
  mappings,
  params
}) => mappings.reduce((acc, mapping) => {
  var _params$mapping$sourc;

  return mapping != null && mapping.target !== 'not_mapped' && mapping.action_type !== 'nothing' && mapping.source !== 'comments' ? [...acc, {
    key: mapping.target,
    value: (_params$mapping$sourc = params[mapping.source]) !== null && _params$mapping$sourc !== void 0 ? _params$mapping$sourc : '',
    actionType: mapping.action_type,
    pipes: // Do not transform titles
    mapping.source !== 'title' ? mapping.action_type === 'append' ? [...defaultPipes, 'append'] : defaultPipes : []
  }] : acc;
}, []);

exports.prepareFieldsForTransformation = prepareFieldsForTransformation;

const transformFields = ({
  params,
  fields,
  currentIncident
}) => {
  return fields.reduce((prev, cur) => {
    var _params$updatedAt;

    const transform = (0, _lodash.flow)(...cur.pipes.map(p => transformers[p]));
    return { ...prev,
      [cur.key]: transform({
        value: cur.value,
        date: (_params$updatedAt = params.updatedAt) !== null && _params$updatedAt !== void 0 ? _params$updatedAt : params.createdAt,
        user: getEntity(params),
        previousValue: currentIncident ? currentIncident[cur.key] : ''
      }).value
    };
  }, {});
};

exports.transformFields = transformFields;

const transformComments = (comments = [], pipes) => comments.map(c => {
  var _c$updated_at;

  return {
    comment: (0, _lodash.flow)(...pipes.map(p => transformers[p]))({
      value: getCommentContent(c),
      date: (_c$updated_at = c.updated_at) !== null && _c$updated_at !== void 0 ? _c$updated_at : c.created_at,
      user: getEntity({
        createdAt: c.created_at,
        createdBy: c.created_by,
        updatedAt: c.updated_at,
        updatedBy: c.updated_by
      })
    }).value,
    commentId: c.id
  };
});

exports.transformComments = transformComments;

const isCommentAlertType = comment => comment.type === _api.CommentType.alert;

exports.isCommentAlertType = isCommentAlertType;

const getCommentContextFromAttributes = attributes => {
  switch (attributes.type) {
    case _api.CommentType.user:
      return {
        type: _api.CommentType.user,
        comment: attributes.comment
      };

    case _api.CommentType.generatedAlert:
    case _api.CommentType.alert:
      return {
        type: attributes.type,
        alertId: attributes.alertId,
        index: attributes.index,
        rule: attributes.rule
      };

    default:
      return {
        type: _api.CommentType.user,
        comment: ''
      };
  }
};

exports.getCommentContextFromAttributes = getCommentContextFromAttributes;