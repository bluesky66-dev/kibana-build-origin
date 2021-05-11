"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initCustomElementsRoutes = initCustomElementsRoutes;

var _find = require("./find");

var _get = require("./get");

var _create = require("./create");

var _update = require("./update");

var _delete = require("./delete");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function initCustomElementsRoutes(deps) {
  (0, _find.initializeFindCustomElementsRoute)(deps);
  (0, _get.initializeGetCustomElementRoute)(deps);
  (0, _create.initializeCreateCustomElementRoute)(deps);
  (0, _update.initializeUpdateCustomElementRoute)(deps);
  (0, _delete.initializeDeleteCustomElementRoute)(deps);
}