"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initPostCaseConfigure = initPostCaseConfigure;

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


function initPostCaseConfigure({
  caseConfigureService,
  caseService,
  router,
  logger
}) {
  router.post({
    path: _constants.CASE_CONFIGURE_URL,
    validate: {
      body: _utils.escapeHatch
    }
  }, async (context, request, response) => {
    try {
      var _context$actions, _post$version;

      let error = null;

      if (!context.case) {
        throw _boom.default.badRequest('RouteHandlerContext is not registered for cases');
      }

      const caseClient = context.case.getCaseClient();
      const actionsClient = (_context$actions = context.actions) === null || _context$actions === void 0 ? void 0 : _context$actions.getActionsClient();

      if (actionsClient == null) {
        throw _boom.default.notFound('Action client not found');
      }

      const client = context.core.savedObjects.client;
      const query = (0, _pipeable.pipe)(_api.CasesConfigureRequestRt.decode(request.body), (0, _Either.fold)((0, _api.throwErrors)(_boom.default.badRequest), _function.identity));
      const myCaseConfigure = await caseConfigureService.find({
        client
      });

      if (myCaseConfigure.saved_objects.length > 0) {
        await Promise.all(myCaseConfigure.saved_objects.map(cc => caseConfigureService.delete({
          client,
          caseConfigureId: cc.id
        })));
      } // eslint-disable-next-line @typescript-eslint/naming-convention


      const {
        email,
        full_name,
        username
      } = await caseService.getUser({
        request
      });
      const creationDate = new Date().toISOString();
      let mappings = [];

      try {
        mappings = await caseClient.getMappings({
          actionsClient,
          connectorId: query.connector.id,
          connectorType: query.connector.type
        });
      } catch (e) {
        error = e.isBoom ? e.output.payload.message : `Error connecting to ${query.connector.name} instance`;
      }

      const post = await caseConfigureService.post({
        client,
        attributes: { ...query,
          connector: (0, _helpers.transformCaseConnectorToEsConnector)(query.connector),
          created_at: creationDate,
          created_by: {
            email,
            full_name,
            username
          },
          updated_at: null,
          updated_by: null
        }
      });
      return response.ok({
        body: _api.CaseConfigureResponseRt.encode({ ...post.attributes,
          // Reserve for future implementations
          connector: (0, _helpers.transformESConnectorToCaseConnector)(post.attributes.connector),
          mappings,
          version: (_post$version = post.version) !== null && _post$version !== void 0 ? _post$version : '',
          error
        })
      });
    } catch (error) {
      logger.error(`Failed to post case configure in route: ${error}`);
      return response.customError((0, _utils.wrapError)(error));
    }
  });
}