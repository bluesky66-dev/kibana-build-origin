"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initGetCasesStatusApi = initGetCasesStatusApi;

var _utils = require("../../utils");

var _api = require("../../../../../common/api");

var _constants = require("../../../../../common/constants");

var _helpers = require("../helpers");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function initGetCasesStatusApi({
  caseService,
  router,
  logger
}) {
  router.get({
    path: _constants.CASE_STATUS_URL,
    validate: {}
  }, async (context, request, response) => {
    try {
      const client = context.core.savedObjects.client;
      const [openCases, inProgressCases, closedCases] = await Promise.all([..._api.caseStatuses.map(status => {
        const statusQuery = (0, _helpers.constructQueryOptions)({
          status
        });
        return caseService.findCaseStatusStats({
          client,
          caseOptions: statusQuery.case,
          subCaseOptions: statusQuery.subCase
        });
      })]);
      return response.ok({
        body: _api.CasesStatusResponseRt.encode({
          count_open_cases: openCases,
          count_in_progress_cases: inProgressCases,
          count_closed_cases: closedCases
        })
      });
    } catch (error) {
      logger.error(`Failed to get status stats in route: ${error}`);
      return response.customError((0, _utils.wrapError)(error));
    }
  });
}