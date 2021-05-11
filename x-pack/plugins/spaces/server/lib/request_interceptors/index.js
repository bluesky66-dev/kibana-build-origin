"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initSpacesRequestInterceptors = initSpacesRequestInterceptors;

var _on_request_interceptor = require("./on_request_interceptor");

var _on_post_auth_interceptor = require("./on_post_auth_interceptor");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function initSpacesRequestInterceptors(deps) {
  (0, _on_request_interceptor.initSpacesOnRequestInterceptor)(deps);
  (0, _on_post_auth_interceptor.initSpacesOnPostAuthRequestInterceptor)(deps);
}