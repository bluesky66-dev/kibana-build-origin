"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setup = setup;

var _http = require("../public/http");

var _fatal_errors_service = require("../public/fatal_errors/fatal_errors_service.mock");

var _injected_metadata_service = require("../public/injected_metadata/injected_metadata_service.mock");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const defaultTap = injectedMetadata => {
  injectedMetadata.getBasePath.mockReturnValue('http://localhost/myBase');
};

function setup(tap = defaultTap) {
  const injectedMetadata = _injected_metadata_service.injectedMetadataServiceMock.createSetupContract();

  const fatalErrors = _fatal_errors_service.fatalErrorsServiceMock.createSetupContract();

  tap(injectedMetadata, fatalErrors);
  const httpService = new _http.HttpService();
  const http = httpService.setup({
    fatalErrors,
    injectedMetadata
  });
  return {
    httpService,
    injectedMetadata,
    fatalErrors,
    http
  };
}