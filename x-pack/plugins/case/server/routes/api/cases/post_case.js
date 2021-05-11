"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initPostCaseApi = initPostCaseApi;

var _utils = require("../utils");

var _constants = require("../../../../common/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function initPostCaseApi({
  router,
  logger
}) {
  router.post({
    path: _constants.CASES_URL,
    validate: {
      body: _utils.escapeHatch
    }
  }, async (context, request, response) => {
    try {
      if (!context.case) {
        return response.badRequest({
          body: 'RouteHandlerContext is not registered for cases'
        });
      }

      const caseClient = context.case.getCaseClient();
      const theCase = request.body;
      return response.ok({
        body: await caseClient.create({ ...theCase
        })
      });
    } catch (error) {
      logger.error(`Failed to post case in route: ${error}`);
      return response.customError((0, _utils.wrapError)(error));
    }
  });
}