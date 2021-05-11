"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.create = void 0;

var _boom = _interopRequireDefault(require("@hapi/boom"));

var _pipeable = require("fp-ts/lib/pipeable");

var _Either = require("fp-ts/lib/Either");

var _function = require("fp-ts/lib/function");

var _utils = require("../../routes/api/utils");

var _api = require("../../../common/api");

var _helpers = require("../../services/user_actions/helpers");

var _helpers2 = require("../../routes/api/cases/helpers");

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
 * Creates a new case.
 */


const create = async ({
  savedObjectsClient,
  caseService,
  caseConfigureService,
  userActionService,
  user,
  theCase,
  logger
}) => {
  // default to an individual case if the type is not defined.
  const {
    type = _api.CaseType.individual,
    ...nonTypeCaseFields
  } = theCase;
  const query = (0, _pipeable.pipe)( // decode with the defaulted type field
  (0, _api.excess)(_api.CaseClientPostRequestRt).decode({
    type,
    ...nonTypeCaseFields
  }), (0, _Either.fold)((0, _api.throwErrors)(_boom.default.badRequest), _function.identity));

  if (type !== _api.CaseType.individual) {
    throw _boom.default.badRequest(`Failed to create case, a case must have type 'individual', but received: '${type}'`);
  }

  try {
    var _query$connector; // eslint-disable-next-line @typescript-eslint/naming-convention


    const {
      username,
      full_name,
      email
    } = user;
    const createdDate = new Date().toISOString();
    const myCaseConfigure = await caseConfigureService.find({
      client: savedObjectsClient
    });
    const caseConfigureConnector = (0, _helpers2.getConnectorFromConfiguration)(myCaseConfigure);
    const newCase = await caseService.postNewCase({
      client: savedObjectsClient,
      attributes: (0, _utils.transformNewCase)({
        createdDate,
        newCase: query,
        username,
        full_name,
        email,
        connector: (0, _helpers2.transformCaseConnectorToEsConnector)((_query$connector = query.connector) !== null && _query$connector !== void 0 ? _query$connector : caseConfigureConnector)
      })
    });
    await userActionService.postUserActions({
      client: savedObjectsClient,
      actions: [(0, _helpers.buildCaseUserActionItem)({
        action: 'create',
        actionAt: createdDate,
        actionBy: {
          username,
          full_name,
          email
        },
        caseId: newCase.id,
        fields: ['description', 'status', 'tags', 'title', 'connector', 'settings'],
        newValue: JSON.stringify(query)
      })]
    });
    return _api.CaseResponseRt.encode((0, _utils.flattenCaseSavedObject)({
      savedObject: newCase
    }));
  } catch (error) {
    throw (0, _error.createCaseError)({
      message: `Failed to create case: ${error}`,
      error,
      logger
    });
  }
};

exports.create = create;