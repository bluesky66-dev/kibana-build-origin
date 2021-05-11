"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.wrapError = wrapError;
exports.decodeCommentRequest = exports.isCommentRequestTypeGenAlert = exports.isCommentRequestTypeAlertOrGenAlert = exports.isCommentRequestTypeUser = exports.escapeHatch = exports.sortToSnake = exports.flattenCommentSavedObject = exports.flattenCommentSavedObjects = exports.transformComments = exports.flattenSubCaseSavedObject = exports.flattenCaseSavedObject = exports.transformSubCases = exports.transformCases = exports.transformNewComment = exports.getAlertInfoFromComments = exports.getAlertIds = exports.transformNewCase = exports.transformNewSubCase = void 0;

var _lodash = require("lodash");

var _boom = require("@hapi/boom");

var _Either = require("fp-ts/lib/Either");

var _function = require("fp-ts/lib/function");

var _pipeable = require("fp-ts/lib/pipeable");

var _configSchema = require("@kbn/config-schema");

var _api = require("../../../common/api");

var _helpers = require("./cases/helpers");

var _types = require("./types");

var _error = require("../../common/error");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const transformNewSubCase = ({
  createdAt,
  createdBy
}) => {
  return {
    closed_at: null,
    closed_by: null,
    created_at: createdAt,
    created_by: createdBy,
    status: _api.CaseStatuses.open,
    updated_at: null,
    updated_by: null
  };
};

exports.transformNewSubCase = transformNewSubCase;

const transformNewCase = ({
  connector,
  createdDate,
  email,
  // eslint-disable-next-line @typescript-eslint/naming-convention
  full_name,
  newCase,
  username
}) => ({ ...newCase,
  closed_at: null,
  closed_by: null,
  connector,
  created_at: createdDate,
  created_by: {
    email,
    full_name,
    username
  },
  external_service: null,
  status: _api.CaseStatuses.open,
  updated_at: null,
  updated_by: null
});

exports.transformNewCase = transformNewCase;
/**
 * Return the alert IDs from the comment if it is an alert style comment. Otherwise return an empty array.
 */

const getAlertIds = comment => {
  if (isCommentRequestTypeAlertOrGenAlert(comment)) {
    return Array.isArray(comment.alertId) ? comment.alertId : [comment.alertId];
  }

  return [];
};

exports.getAlertIds = getAlertIds;

const getIDsAndIndicesAsArrays = comment => {
  return {
    ids: Array.isArray(comment.alertId) ? comment.alertId : [comment.alertId],
    indices: Array.isArray(comment.index) ? comment.index : [comment.index]
  };
};
/**
 * This functions extracts the ids and indices from an alert comment. It enforces that the alertId and index are either
 * both strings or string arrays that are the same length. If they are arrays they represent a 1-to-1 mapping of
 * id existing in an index at each position in the array. This is not ideal. Ideally an alert comment request would
 * accept an array of objects like this: Array<{id: string; index: string; ruleName: string ruleID: string}> instead.
 *
 * To reformat the alert comment request requires a migration and a breaking API change.
 */


const getAndValidateAlertInfoFromComment = comment => {
  if (!isCommentRequestTypeAlertOrGenAlert(comment)) {
    return [];
  }

  const {
    ids,
    indices
  } = getIDsAndIndicesAsArrays(comment);

  if (ids.length !== indices.length) {
    return [];
  }

  return ids.map((id, index) => ({
    id,
    index: indices[index]
  }));
};
/**
 * Builds an AlertInfo object accumulating the alert IDs and indices for the passed in alerts.
 */


const getAlertInfoFromComments = comments => {
  if (comments === undefined) {
    return [];
  }

  return comments.reduce((acc, comment) => {
    const alertInfo = getAndValidateAlertInfoFromComment(comment);
    acc.push(...alertInfo);
    return acc;
  }, []);
};

exports.getAlertInfoFromComments = getAlertInfoFromComments;

const transformNewComment = ({
  associationType,
  createdDate,
  email,
  // eslint-disable-next-line @typescript-eslint/naming-convention
  full_name,
  username,
  ...comment
}) => {
  return {
    associationType,
    ...comment,
    created_at: createdDate,
    created_by: {
      email,
      full_name,
      username
    },
    pushed_at: null,
    pushed_by: null,
    updated_at: null,
    updated_by: null
  };
};
/**
 * Transforms an error into the correct format for a kibana response.
 */


exports.transformNewComment = transformNewComment;

function wrapError(error) {
  let boom;

  if ((0, _error.isCaseError)(error)) {
    boom = error.boomify();
  } else {
    var _error$statusCode;

    const options = {
      statusCode: (_error$statusCode = error.statusCode) !== null && _error$statusCode !== void 0 ? _error$statusCode : 500
    };
    boom = (0, _boom.isBoom)(error) ? error : (0, _boom.boomify)(error, options);
  }

  return {
    body: boom,
    headers: boom.output.headers,
    statusCode: boom.output.statusCode
  };
}

const transformCases = ({
  casesMap,
  countOpenCases,
  countInProgressCases,
  countClosedCases,
  page,
  perPage,
  total
}) => ({
  page,
  per_page: perPage,
  total,
  cases: Array.from(casesMap.values()),
  count_open_cases: countOpenCases,
  count_in_progress_cases: countInProgressCases,
  count_closed_cases: countClosedCases
});

exports.transformCases = transformCases;

const transformSubCases = ({
  subCasesMap,
  open,
  inProgress,
  closed,
  page,
  perPage,
  total
}) => ({
  page,
  per_page: perPage,
  total,
  // Squish all the entries in the map together as one array
  subCases: Array.from(subCasesMap.values()).flat(),
  count_open_cases: open,
  count_in_progress_cases: inProgress,
  count_closed_cases: closed
});

exports.transformSubCases = transformSubCases;

const flattenCaseSavedObject = ({
  savedObject,
  comments = [],
  totalComment = comments.length,
  totalAlerts = 0,
  subCases,
  subCaseIds
}) => {
  var _savedObject$version;

  return {
    id: savedObject.id,
    version: (_savedObject$version = savedObject.version) !== null && _savedObject$version !== void 0 ? _savedObject$version : '0',
    comments: flattenCommentSavedObjects(comments),
    totalComment,
    totalAlerts,
    ...savedObject.attributes,
    connector: (0, _helpers.transformESConnectorToCaseConnector)(savedObject.attributes.connector),
    subCases,
    subCaseIds: !(0, _lodash.isEmpty)(subCaseIds) ? subCaseIds : undefined
  };
};

exports.flattenCaseSavedObject = flattenCaseSavedObject;

const flattenSubCaseSavedObject = ({
  savedObject,
  comments = [],
  totalComment = comments.length,
  totalAlerts = 0
}) => {
  var _savedObject$version2;

  return {
    id: savedObject.id,
    version: (_savedObject$version2 = savedObject.version) !== null && _savedObject$version2 !== void 0 ? _savedObject$version2 : '0',
    comments: flattenCommentSavedObjects(comments),
    totalComment,
    totalAlerts,
    ...savedObject.attributes
  };
};

exports.flattenSubCaseSavedObject = flattenSubCaseSavedObject;

const transformComments = comments => ({
  page: comments.page,
  per_page: comments.per_page,
  total: comments.total,
  comments: flattenCommentSavedObjects(comments.saved_objects)
});

exports.transformComments = transformComments;

const flattenCommentSavedObjects = savedObjects => savedObjects.reduce((acc, savedObject) => {
  return [...acc, flattenCommentSavedObject(savedObject)];
}, []);

exports.flattenCommentSavedObjects = flattenCommentSavedObjects;

const flattenCommentSavedObject = savedObject => {
  var _savedObject$version3;

  return {
    id: savedObject.id,
    version: (_savedObject$version3 = savedObject.version) !== null && _savedObject$version3 !== void 0 ? _savedObject$version3 : '0',
    ...savedObject.attributes
  };
};

exports.flattenCommentSavedObject = flattenCommentSavedObject;

const sortToSnake = sortField => {
  switch (sortField) {
    case 'status':
      return _types.SortFieldCase.status;

    case 'createdAt':
    case 'created_at':
      return _types.SortFieldCase.createdAt;

    case 'closedAt':
    case 'closed_at':
      return _types.SortFieldCase.closedAt;

    default:
      return _types.SortFieldCase.createdAt;
  }
};

exports.sortToSnake = sortToSnake;

const escapeHatch = _configSchema.schema.object({}, {
  unknowns: 'allow'
});
/**
 * A type narrowing function for user comments. Exporting so integration tests can use it.
 */


exports.escapeHatch = escapeHatch;

const isCommentRequestTypeUser = context => {
  return context.type === _api.CommentType.user;
};
/**
 * A type narrowing function for alert comments. Exporting so integration tests can use it.
 */


exports.isCommentRequestTypeUser = isCommentRequestTypeUser;

const isCommentRequestTypeAlertOrGenAlert = context => {
  return context.type === _api.CommentType.alert || context.type === _api.CommentType.generatedAlert;
};
/**
 * This is used to test if the posted comment is an generated alert. A generated alert will have one or many alerts.
 * An alert is essentially an object with a _id field. This differs from a regular attached alert because the _id is
 * passed directly in the request, it won't be in an object. Internally case will strip off the outer object and store
 * both a generated and user attached alert in the same structure but this function is useful to determine which
 * structure the new alert in the request has.
 */


exports.isCommentRequestTypeAlertOrGenAlert = isCommentRequestTypeAlertOrGenAlert;

const isCommentRequestTypeGenAlert = context => {
  return context.type === _api.CommentType.generatedAlert;
};

exports.isCommentRequestTypeGenAlert = isCommentRequestTypeGenAlert;

const decodeCommentRequest = comment => {
  if (isCommentRequestTypeUser(comment)) {
    (0, _pipeable.pipe)((0, _api.excess)(_api.ContextTypeUserRt).decode(comment), (0, _Either.fold)((0, _api.throwErrors)(_boom.badRequest), _function.identity));
  } else if (isCommentRequestTypeAlertOrGenAlert(comment)) {
    (0, _pipeable.pipe)((0, _api.excess)(_api.AlertCommentRequestRt).decode(comment), (0, _Either.fold)((0, _api.throwErrors)(_boom.badRequest), _function.identity));
    const {
      ids,
      indices
    } = getIDsAndIndicesAsArrays(comment);
    /**
     * The alertId and index field must either be both of type string or they must both be string[] and be the same length.
     * Having a one-to-one relationship between the id and index of an alert avoids accidentally updating or
     * retrieving the wrong alert. Elasticsearch only guarantees that the _id (the field we use for alertId) to be
     * unique within a single index. So if we attempt to update or get a specific alert across multiple indices we could
     * update or receive the wrong one.
     *
     * Consider the situation where we have a alert1 with _id = '100' in index 'my-index-awesome' and also in index
     *  'my-index-hi'.
     * If we attempt to update the status of alert1 using an index pattern like `my-index-*` or even providing multiple
     * indices, there's a chance we'll accidentally update too many alerts.
     *
     * This check doesn't enforce that the API request has the correct alert ID to index relationship it just guards
     * against accidentally making a request like:
     * {
     *  alertId: [1,2,3],
     *  index: awesome,
     * }
     *
     * Instead this requires the requestor to provide:
     * {
     *  alertId: [1,2,3],
     *  index: [awesome, awesome, awesome]
     * }
     *
     * Ideally we'd change the format of the comment request to be an array of objects like:
     * {
     *  alerts: [{id: 1, index: awesome}, {id: 2, index: awesome}]
     * }
     *
     * But we'd need to also implement a migration because the saved object document currently stores the id and index
     * in separate fields.
     */

    if (ids.length !== indices.length) {
      throw (0, _boom.badRequest)(`Received an alert comment with ids and indices arrays of different lengths ids: ${JSON.stringify(ids)} indices: ${JSON.stringify(indices)}`);
    }
  }
};

exports.decodeCommentRequest = decodeCommentRequest;