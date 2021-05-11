"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initShareablesRoutes = initShareablesRoutes;

var _zip = require("./zip");

var _download = require("./download");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function initShareablesRoutes(deps) {
  (0, _download.initializeDownloadShareableWorkpadRoute)(deps);
  (0, _zip.initializeZipShareableWorkpadRoute)(deps);
}