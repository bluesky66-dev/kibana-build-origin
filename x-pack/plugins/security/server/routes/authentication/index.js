"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defineAuthenticationRoutes = defineAuthenticationRoutes;

var _saml = require("./saml");

var _common = require("./common");

var _oidc = require("./oidc");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function defineAuthenticationRoutes(params) {
  (0, _common.defineCommonRoutes)(params);

  if (params.config.authc.sortedProviders.some(({
    type
  }) => type === 'saml')) {
    (0, _saml.defineSAMLRoutes)(params);
  }

  if (params.config.authc.sortedProviders.some(({
    type
  }) => type === 'oidc')) {
    (0, _oidc.defineOIDCRoutes)(params);
  }
}