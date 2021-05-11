"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initPatchCaseConfigure = initPatchCaseConfigure;

var _boom = _interopRequireDefault(require("@hapi/boom"));

var _pipeable = require("fp-ts/lib/pipeable");

var _Either = require("fp-ts/lib/Either");

var _function = require("fp-ts/lib/function");

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


function initPatchCaseConfigure({
  caseConfigureService,
  caseService,
  router,
  logger
}) {
  router.patch({
    path: _constants.CASE_CONFIGURE_URL,
    validate: {
      body: _utils.escapeHatch
    }
  }, async (context, request, response) => {
    try {
      var _patch$attributes$con, _patch$version;

      let error = null;
      const client = context.core.savedObjects.client;
      const query = (0, _pipeable.pipe)(_api.CasesConfigurePatchRt.decode(request.body), (0, _Either.fold)((0, _api.throwErrors)(_boom.default.badRequest), _function.identity));
      const myCaseConfigure = await caseConfigureService.find({
        client
      });
      const {
        version,
        connector,
        ...queryWithoutVersion
      } = query;

      if (myCaseConfigure.saved_objects.length === 0) {
        throw _boom.default.conflict('You can not patch this configuration since you did not created first with a post.');
      }

      if (version !== myCaseConfigure.saved_objects[0].version) {
        throw _boom.default.conflict('This configuration has been updated. Please refresh before saving additional updates.');
      } // eslint-disable-next-line @typescript-eslint/naming-convention


      const {
        username,
        full_name,
        email
      } = await caseService.getUser({
        request
      });
      const updateDate = new Date().toISOString();
      let mappings = [];

      if (connector != null) {
        var _context$actions;

        if (!context.case) {
          throw _boom.default.badRequest('RouteHandlerContext is not registered for cases');
        }

        const caseClient = context.case.getCaseClient();
        const actionsClient = (_context$actions = context.actions) === null || _context$actions === void 0 ? void 0 : _context$actions.getActionsClient();

        if (actionsClient == null) {
          throw _boom.default.notFound('Action client have not been found');
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

      const patch = await caseConfigureService.patch({
        client,
        caseConfigureId: myCaseConfigure.saved_objects[0].id,
        updatedAttributes: { ...queryWithoutVersion,
          ...(connector != null ? {
            connector: (0, _helpers.transformCaseConnectorToEsConnector)(connector)
          } : {}),
          updated_at: updateDate,
          updated_by: {
            email,
            full_name,
            username
          }
        }
      });
      return response.ok({
        body: _api.CaseConfigureResponseRt.encode({ ...myCaseConfigure.saved_objects[0].attributes,
          ...patch.attributes,
          connector: (0, _helpers.transformESConnectorToCaseConnector)((_patch$attributes$con = patch.attributes.connector) !== null && _patch$attributes$con !== void 0 ? _patch$attributes$con : myCaseConfigure.saved_objects[0].attributes.connector),
          mappings,
          version: (_patch$version = patch.version) !== null && _patch$version !== void 0 ? _patch$version : '',
          error
        })
      });
    } catch (error) {
      logger.error(`Failed to get patch configure in route: ${error}`);
      return response.customError((0, _utils.wrapError)(error));
    }
  });
}