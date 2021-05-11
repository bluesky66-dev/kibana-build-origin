"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerRoutes = void 0;

var _find = require("./find");

var _get_searchable_types = require("./get_searchable_types");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const registerRoutes = router => {
  (0, _find.registerInternalFindRoute)(router);
  (0, _get_searchable_types.registerInternalSearchableTypesRoute)(router);
};

exports.registerRoutes = registerRoutes;