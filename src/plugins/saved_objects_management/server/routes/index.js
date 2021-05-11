"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerRoutes = registerRoutes;

var _find = require("./find");

var _get = require("./get");

var _scroll_count = require("./scroll_count");

var _scroll_export = require("./scroll_export");

var _relationships = require("./relationships");

var _get_allowed_types = require("./get_allowed_types");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function registerRoutes({
  http,
  managementServicePromise
}) {
  const router = http.createRouter();
  (0, _find.registerFindRoute)(router, managementServicePromise);
  (0, _get.registerGetRoute)(router, managementServicePromise);
  (0, _scroll_count.registerScrollForCountRoute)(router);
  (0, _scroll_export.registerScrollForExportRoute)(router);
  (0, _relationships.registerRelationshipsRoute)(router, managementServicePromise);
  (0, _get_allowed_types.registerGetAllowedTypesRoute)(router);
}