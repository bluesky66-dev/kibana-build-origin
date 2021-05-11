"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initFindCasesApi = initFindCasesApi;

var _boom = _interopRequireDefault(require("@hapi/boom"));

var _pipeable = require("fp-ts/lib/pipeable");

var _Either = require("fp-ts/lib/Either");

var _function = require("fp-ts/lib/function");

var _api = require("../../../../common/api");

var _utils = require("../utils");

var _constants = require("../../../../common/constants");

var _helpers = require("./helpers");

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


function initFindCasesApi({
  caseService,
  router,
  logger
}) {
  router.get({
    path: `${_constants.CASES_URL}/_find`,
    validate: {
      query: _utils.escapeHatch
    }
  }, async (context, request, response) => {
    try {
      const client = context.core.savedObjects.client;
      const queryParams = (0, _pipeable.pipe)(_api.CasesFindRequestRt.decode(request.query), (0, _Either.fold)((0, _api.throwErrors)(_boom.default.badRequest), _function.identity));
      const queryArgs = {
        tags: queryParams.tags,
        reporters: queryParams.reporters,
        sortByField: queryParams.sortField,
        status: queryParams.status,
        caseType: queryParams.type
      };
      const caseQueries = (0, _helpers.constructQueryOptions)(queryArgs);
      const cases = await caseService.findCasesGroupedByID({
        client,
        caseOptions: { ...queryParams,
          ...caseQueries.case
        },
        subCaseOptions: caseQueries.subCase
      });
      const [openCases, inProgressCases, closedCases] = await Promise.all([..._api.caseStatuses.map(status => {
        const statusQuery = (0, _helpers.constructQueryOptions)({ ...queryArgs,
          status
        });
        return caseService.findCaseStatusStats({
          client,
          caseOptions: statusQuery.case,
          subCaseOptions: statusQuery.subCase
        });
      })]);
      return response.ok({
        body: _api.CasesFindResponseRt.encode((0, _utils.transformCases)({
          casesMap: cases.casesMap,
          page: cases.page,
          perPage: cases.perPage,
          total: cases.total,
          countOpenCases: openCases,
          countInProgressCases: inProgressCases,
          countClosedCases: closedCases
        }))
      });
    } catch (error) {
      logger.error(`Failed to find cases in route: ${error}`);
      return response.customError((0, _utils.wrapError)(error));
    }
  });
}