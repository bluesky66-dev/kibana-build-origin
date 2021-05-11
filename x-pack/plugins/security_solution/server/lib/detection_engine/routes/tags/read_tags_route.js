"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.readTagsRoute = void 0;

var _constants = require("../../../../../common/constants");

var _utils = require("../utils");

var _read_tags = require("../../tags/read_tags");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const readTagsRoute = router => {
  router.get({
    path: _constants.DETECTION_ENGINE_TAGS_URL,
    validate: false,
    options: {
      tags: ['access:securitySolution']
    }
  }, async (context, request, response) => {
    var _context$alerting;

    const siemResponse = (0, _utils.buildSiemResponse)(response);
    const alertsClient = (_context$alerting = context.alerting) === null || _context$alerting === void 0 ? void 0 : _context$alerting.getAlertsClient();

    if (!alertsClient) {
      return siemResponse.error({
        statusCode: 404
      });
    }

    try {
      const tags = await (0, _read_tags.readTags)({
        alertsClient
      });
      return response.ok({
        body: tags
      });
    } catch (err) {
      const error = (0, _utils.transformError)(err);
      return siemResponse.error({
        body: error.message,
        statusCode: error.statusCode
      });
    }
  });
};

exports.readTagsRoute = readTagsRoute;