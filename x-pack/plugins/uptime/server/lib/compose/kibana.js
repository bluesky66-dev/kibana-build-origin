"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.compose = compose;

var _framework = require("../adapters/framework");

var _requests = require("../requests");

var _domains = require("../domains");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function compose(server) {
  const framework = new _framework.UMKibanaBackendFrameworkAdapter(server);
  return {
    framework,
    requests: _requests.requests,
    license: _domains.licenseCheck
  };
}