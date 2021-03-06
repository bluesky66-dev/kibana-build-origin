"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.init = void 0;

var _sinon = _interopRequireDefault(require("sinon"));

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// Register helpers to mock HTTP Requests


const registerHttpRequestMockHelpers = server => {
  const mockResponse = response => [200, {
    'Content-Type': 'application/json'
  }, JSON.stringify(response)];

  const setLoadRemoteClustersResponse = response => {
    server.respondWith('GET', '/api/remote_clusters', [200, {
      'Content-Type': 'application/json'
    }, JSON.stringify(response)]);
  };

  const setDeleteRemoteClusterResponse = response => {
    server.respondWith('DELETE', /api\/remote_clusters/, mockResponse(response));
  };

  return {
    setLoadRemoteClustersResponse,
    setDeleteRemoteClusterResponse
  };
};

const init = () => {
  const server = _sinon.default.fakeServer.create();

  server.respondImmediately = true; // We make requests to APIs which don't impact the UX, e.g. UI metric telemetry,
  // and we can mock them all with a 200 instead of mocking each one individually.

  server.respondWith([200, {}, '']);
  return {
    server,
    httpRequestsMockHelpers: registerHttpRequestMockHelpers(server)
  };
};

exports.init = init;