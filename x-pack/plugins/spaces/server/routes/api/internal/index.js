"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initInternalSpacesApi = initInternalSpacesApi;

var _get_active_space = require("./get_active_space");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function initInternalSpacesApi(deps) {
  (0, _get_active_space.initGetActiveSpaceApi)(deps);
}