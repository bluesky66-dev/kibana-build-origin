"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getActionType = getActionType;
exports.transformConnectorComment = void 0;

var _lodash = require("lodash");

var _client = require("../../client");

var _schema = require("./schema");

var i18n = _interopRequireWildcard(require("./translations"));

var _common = require("../../common");

var _error = require("../../common/error");

function _getRequireWildcardCache() {
  if (typeof WeakMap !== "function") return null;
  var cache = new WeakMap();

  _getRequireWildcardCache = function () {
    return cache;
  };

  return cache;
}

function _interopRequireWildcard(obj) {
  if (obj && obj.__esModule) {
    return obj;
  }

  if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
    return {
      default: obj
    };
  }

  var cache = _getRequireWildcardCache();

  if (cache && cache.has(obj)) {
    return cache.get(obj);
  }

  var newObj = {};
  var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;

  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;

      if (desc && (desc.get || desc.set)) {
        Object.defineProperty(newObj, key, desc);
      } else {
        newObj[key] = obj[key];
      }
    }
  }

  newObj.default = obj;

  if (cache) {
    cache.set(obj, newObj);
  }

  return newObj;
}
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const supportedSubActions = ['create', 'update', 'addComment']; // action type definition

function getActionType({
  logger,
  caseService,
  caseConfigureService,
  connectorMappingsService,
  userActionService,
  alertsService
}) {
  return {
    id: '.case',
    minimumLicenseRequired: 'basic',
    name: i18n.NAME,
    validate: {
      config: _schema.CaseConfigurationSchema,
      params: _schema.CaseExecutorParamsSchema
    },
    executor: (0, _lodash.curry)(executor)({
      alertsService,
      caseConfigureService,
      caseService,
      connectorMappingsService,
      logger,
      userActionService
    })
  };
} // action executor


async function executor({
  alertsService,
  caseConfigureService,
  caseService,
  connectorMappingsService,
  logger,
  userActionService
}, execOptions) {
  var _data;

  const {
    actionId,
    params,
    services
  } = execOptions;
  const {
    subAction,
    subActionParams
  } = params;
  let data = null;
  const {
    savedObjectsClient,
    scopedClusterClient
  } = services;
  const caseClient = (0, _client.createExternalCaseClient)({
    savedObjectsClient,
    scopedClusterClient,
    // we might want the user information to be passed as part of the action request
    user: _common.nullUser,
    caseService,
    caseConfigureService,
    connectorMappingsService,
    userActionService,
    alertsService,
    logger
  });

  if (!supportedSubActions.includes(subAction)) {
    const errorMessage = `[Action][Case] subAction ${subAction} not implemented.`;
    logger.error(errorMessage);
    throw new Error(errorMessage);
  }

  if (subAction === 'create') {
    try {
      data = await caseClient.create({ ...subActionParams
      });
    } catch (error) {
      throw (0, _error.createCaseError)({
        message: `Failed to create a case using connector: ${error}`,
        error,
        logger
      });
    }
  }

  if (subAction === 'update') {
    const updateParamsWithoutNullValues = Object.entries(subActionParams).reduce((acc, [key, value]) => ({ ...acc,
      ...(value != null ? {
        [key]: value
      } : {})
    }), {});

    try {
      data = await caseClient.update({
        cases: [updateParamsWithoutNullValues]
      });
    } catch (error) {
      throw (0, _error.createCaseError)({
        message: `Failed to update case using connector id: ${updateParamsWithoutNullValues === null || updateParamsWithoutNullValues === void 0 ? void 0 : updateParamsWithoutNullValues.id} version: ${updateParamsWithoutNullValues === null || updateParamsWithoutNullValues === void 0 ? void 0 : updateParamsWithoutNullValues.version}: ${error}`,
        error,
        logger
      });
    }
  }

  if (subAction === 'addComment') {
    const {
      caseId,
      comment
    } = subActionParams;

    try {
      const formattedComment = transformConnectorComment(comment, logger);
      data = await caseClient.addComment({
        caseId,
        comment: formattedComment
      });
    } catch (error) {
      throw (0, _error.createCaseError)({
        message: `Failed to create comment using connector case id: ${caseId}: ${error}`,
        error,
        logger
      });
    }
  }

  return {
    status: 'ok',
    data: (_data = data) !== null && _data !== void 0 ? _data : {},
    actionId
  };
}
/**
 * Convert a connector style comment passed through the action plugin to the expected format for the add comment functionality.
 *
 * @param comment an object defining the comment to be attached to a case/sub case
 * @param logger an optional logger to handle logging an error if parsing failed
 *
 * Note: This is exported so that the integration tests can use it.
 */


const transformConnectorComment = (comment, logger) => {
  return comment;
};

exports.transformConnectorComment = transformConnectorComment;