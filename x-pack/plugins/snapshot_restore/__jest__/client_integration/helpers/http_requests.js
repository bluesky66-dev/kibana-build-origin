"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.init = void 0;

var _sinon = _interopRequireDefault(require("sinon"));

var _constants = require("../../../common/constants");

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


const mockResponse = (defaultResponse, response) => [200, {
  'Content-Type': 'application/json'
}, JSON.stringify({ ...defaultResponse,
  ...response
})]; // Register helpers to mock HTTP Requests


const registerHttpRequestMockHelpers = server => {
  const setLoadRepositoriesResponse = (response = {}) => {
    const defaultResponse = {
      repositories: []
    };
    server.respondWith('GET', `${_constants.API_BASE_PATH}repositories`, mockResponse(defaultResponse, response));
  };

  const setLoadRepositoryTypesResponse = (response = []) => {
    server.respondWith('GET', `${_constants.API_BASE_PATH}repository_types`, JSON.stringify(response));
  };

  const setGetRepositoryResponse = (response, delay = 0) => {
    const defaultResponse = {};
    server.respondWith('GET', /api\/snapshot_restore\/repositories\/.+/, mockResponse(defaultResponse, response));
  };

  const setSaveRepositoryResponse = (response, error) => {
    const status = error ? error.status || 400 : 200;
    const body = error ? JSON.stringify(error.body) : JSON.stringify(response);
    server.respondWith('PUT', `${_constants.API_BASE_PATH}repositories`, [status, {
      'Content-Type': 'application/json'
    }, body]);
  };

  const setLoadSnapshotsResponse = (response = {}) => {
    const defaultResponse = {
      errors: {},
      snapshots: [],
      repositories: []
    };
    server.respondWith('GET', `${_constants.API_BASE_PATH}snapshots`, mockResponse(defaultResponse, response));
  };

  const setGetSnapshotResponse = response => {
    const defaultResponse = {};
    server.respondWith('GET', /\/api\/snapshot_restore\/snapshots\/.+/, mockResponse(defaultResponse, response));
  };

  const setLoadIndicesResponse = (response = {}) => {
    const defaultResponse = {
      indices: []
    };
    server.respondWith('GET', `${_constants.API_BASE_PATH}policies/indices`, mockResponse(defaultResponse, response));
  };

  const setAddPolicyResponse = (response, error) => {
    const status = error ? error.status || 400 : 200;
    const body = error ? JSON.stringify(error.body) : JSON.stringify(response);
    server.respondWith('POST', `${_constants.API_BASE_PATH}policies`, [status, {
      'Content-Type': 'application/json'
    }, body]);
  };

  const setCleanupRepositoryResponse = (response, error) => {
    const status = error ? error.status || 503 : 200;
    server.respondWith('POST', `${_constants.API_BASE_PATH}repositories/:name/cleanup`, [status, {
      'Content-Type': 'application/json'
    }, JSON.stringify(response)]);
  };

  const setGetPolicyResponse = response => {
    server.respondWith('GET', `${_constants.API_BASE_PATH}policy/:name`, [200, {
      'Content-Type': 'application/json'
    }, JSON.stringify(response)]);
  };

  return {
    setLoadRepositoriesResponse,
    setLoadRepositoryTypesResponse,
    setGetRepositoryResponse,
    setSaveRepositoryResponse,
    setLoadSnapshotsResponse,
    setGetSnapshotResponse,
    setLoadIndicesResponse,
    setAddPolicyResponse,
    setGetPolicyResponse,
    setCleanupRepositoryResponse
  };
};

const init = () => {
  const server = _sinon.default.fakeServer.create();

  server.respondImmediately = true; // Define default response for unhandled requests.
  // We make requests to APIs which don't impact the component under test, e.g. UI metric telemetry,
  // and we can mock them all with a 200 instead of mocking each one individually.

  server.respondWith([200, {}, 'DefaultResponse']);
  const httpRequestsMockHelpers = registerHttpRequestMockHelpers(server);
  return {
    server,
    httpRequestsMockHelpers
  };
};

exports.init = init;