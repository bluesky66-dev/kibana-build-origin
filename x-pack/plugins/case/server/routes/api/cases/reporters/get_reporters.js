"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initGetReportersApi = initGetReportersApi;

var _api = require("../../../../../common/api");

var _utils = require("../../utils");

var _constants = require("../../../../../common/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function initGetReportersApi({
  caseService,
  router,
  logger
}) {
  router.get({
    path: _constants.CASE_REPORTERS_URL,
    validate: {}
  }, async (context, request, response) => {
    try {
      const client = context.core.savedObjects.client;
      const reporters = await caseService.getReporters({
        client
      });
      return response.ok({
        body: _api.UsersRt.encode(reporters)
      });
    } catch (error) {
      logger.error(`Failed to get reporters in route: ${error}`);
      return response.customError((0, _utils.wrapError)(error));
    }
  });
}