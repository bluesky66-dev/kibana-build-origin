"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initCaseConfigureGetActionConnector = initCaseConfigureGetActionConnector;

var _boom = _interopRequireDefault(require("@hapi/boom"));

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


const isConnectorSupported = (action, actionTypes) => {
  var _actionTypes$action$a;

  return _constants.SUPPORTED_CONNECTORS.includes(action.actionTypeId) && ((_actionTypes$action$a = actionTypes[action.actionTypeId]) === null || _actionTypes$action$a === void 0 ? void 0 : _actionTypes$action$a.enabledInLicense);
};
/*
 * Be aware that this api will only return 20 connectors
 */


function initCaseConfigureGetActionConnector({
  router,
  logger
}) {
  router.get({
    path: `${_constants.CASE_CONFIGURE_CONNECTORS_URL}/_find`,
    validate: false
  }, async (context, request, response) => {
    try {
      var _context$actions;

      const actionsClient = (_context$actions = context.actions) === null || _context$actions === void 0 ? void 0 : _context$actions.getActionsClient();

      if (actionsClient == null) {
        throw _boom.default.notFound('Action client not found');
      }

      const actionTypes = (await actionsClient.listTypes()).reduce((types, type) => ({ ...types,
        [type.id]: type
      }), {});
      const results = (await actionsClient.getAll()).filter(action => isConnectorSupported(action, actionTypes));
      return response.ok({
        body: results
      });
    } catch (error) {
      logger.error(`Failed to get connectors in route: ${error}`);
      return response.customError((0, _utils.wrapError)(error));
    }
  });
}