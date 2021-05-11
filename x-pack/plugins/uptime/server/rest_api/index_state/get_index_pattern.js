"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createGetIndexPatternRoute = void 0;

var _constants = require("../../../common/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const createGetIndexPatternRoute = libs => ({
  method: 'GET',
  path: _constants.API_URLS.INDEX_PATTERN,
  validate: false,
  handler: async ({
    uptimeEsClient
  }) => {
    return await libs.requests.getIndexPattern({
      uptimeEsClient
    });
  }
});

exports.createGetIndexPatternRoute = createGetIndexPatternRoute;