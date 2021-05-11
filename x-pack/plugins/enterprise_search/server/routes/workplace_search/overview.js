"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerOverviewRoute = registerOverviewRoute;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function registerOverviewRoute({
  router,
  enterpriseSearchRequestHandler
}) {
  router.get({
    path: '/api/workplace_search/overview',
    validate: false
  }, enterpriseSearchRequestHandler.createRequest({
    path: '/ws/org',
    hasValidData: body => typeof (body === null || body === void 0 ? void 0 : body.accountsCount) === 'number'
  }));
}