"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initGetCaseConfigure = initGetCaseConfigure;

var _boom = _interopRequireDefault(require("@hapi/boom"));

var _api = require("../../../../../common/api");

var _utils = require("../../utils");

var _constants = require("../../../../../common/constants");

var _helpers = require("../helpers");

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


function initGetCaseConfigure({
  caseConfigureService,
  router,
  logger
}) {
  router.get({
    path: _constants.CASE_CONFIGURE_URL,
    validate: false
  }, async (context, request, response) => {
    try {
      var _myCaseConfigure$save, _myCaseConfigure$save2, _myCaseConfigure$save3;

      let error = null;
      const client = context.core.savedObjects.client;
      const myCaseConfigure = await caseConfigureService.find({
        client
      });
      const {
        connector,
        ...caseConfigureWithoutConnector
      } = (_myCaseConfigure$save = (_myCaseConfigure$save2 = myCaseConfigure.saved_objects[0]) === null || _myCaseConfigure$save2 === void 0 ? void 0 : _myCaseConfigure$save2.attributes) !== null && _myCaseConfigure$save !== void 0 ? _myCaseConfigure$save : {
        connector: null
      };
      let mappings = [];

      if (connector != null) {
        var _context$actions;

        if (!context.case) {
          throw _boom.default.badRequest('RouteHandlerContext is not registered for cases');
        }

        const caseClient = context.case.getCaseClient();
        const actionsClient = (_context$actions = context.actions) === null || _context$actions === void 0 ? void 0 : _context$actions.getActionsClient();

        if (actionsClient == null) {
          throw _boom.default.notFound('Action client not found');
        }

        try {
          mappings = await caseClient.getMappings({
            actionsClient,
            connectorId: connector.id,
            connectorType: connector.type
          });
        } catch (e) {
          error = e.isBoom ? e.output.payload.message : `Error connecting to ${connector.name} instance`;
        }
      }

      return response.ok({
        body: myCaseConfigure.saved_objects.length > 0 ? _api.CaseConfigureResponseRt.encode({ ...caseConfigureWithoutConnector,
          connector: (0, _helpers.transformESConnectorToCaseConnector)(connector),
          mappings,
          version: (_myCaseConfigure$save3 = myCaseConfigure.saved_objects[0].version) !== null && _myCaseConfigure$save3 !== void 0 ? _myCaseConfigure$save3 : '',
          error
        }) : {}
      });
    } catch (error) {
      logger.error(`Failed to get case configure in route: ${error}`);
      return response.customError((0, _utils.wrapError)(error));
    }
  });
}