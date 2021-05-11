"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initPushCaseApi = initPushCaseApi;

var _boom = _interopRequireDefault(require("@hapi/boom"));

var _pipeable = require("fp-ts/lib/pipeable");

var _Either = require("fp-ts/lib/Either");

var _function = require("fp-ts/lib/function");

var _utils = require("../utils");

var _api = require("../../../../common/api");

var _constants = require("../../../../common/constants");

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


function initPushCaseApi({
  router,
  logger
}) {
  router.post({
    path: _constants.CASE_PUSH_URL,
    validate: {
      params: _utils.escapeHatch,
      body: _utils.escapeHatch
    }
  }, async (context, request, response) => {
    try {
      var _context$actions;

      if (!context.case) {
        return response.badRequest({
          body: 'RouteHandlerContext is not registered for cases'
        });
      }

      const caseClient = context.case.getCaseClient();
      const actionsClient = (_context$actions = context.actions) === null || _context$actions === void 0 ? void 0 : _context$actions.getActionsClient();

      if (actionsClient == null) {
        return response.badRequest({
          body: 'Action client not found'
        });
      }

      const params = (0, _pipeable.pipe)(_api.CasePushRequestParamsRt.decode(request.params), (0, _Either.fold)((0, _api.throwErrors)(_boom.default.badRequest), _function.identity));
      return response.ok({
        body: await caseClient.push({
          actionsClient,
          caseId: params.case_id,
          connectorId: params.connector_id
        })
      });
    } catch (error) {
      logger.error(`Failed to push case in route: ${error}`);
      return response.customError((0, _utils.wrapError)(error));
    }
  });
}