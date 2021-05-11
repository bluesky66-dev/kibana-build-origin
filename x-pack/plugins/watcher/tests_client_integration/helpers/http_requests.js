"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.init = void 0;

var _sinon = _interopRequireDefault(require("sinon"));

var _constants = require("../../common/constants");

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


const {
  API_ROOT
} = _constants.ROUTES;

const mockResponse = (defaultResponse, response) => [200, {
  'Content-Type': 'application/json'
}, JSON.stringify({ ...defaultResponse,
  ...response
})]; // Register helpers to mock HTTP Requests


const registerHttpRequestMockHelpers = server => {
  const setLoadWatchesResponse = (response = {}) => {
    const defaultResponse = {
      watches: []
    };
    server.respondWith('GET', `${API_ROOT}/watches`, mockResponse(defaultResponse, response));
  };

  const setLoadWatchResponse = (response = {}) => {
    const defaultResponse = {
      watch: {}
    };
    server.respondWith('GET', `${API_ROOT}/watch/:id`, mockResponse(defaultResponse, response));
  };

  const setLoadWatchHistoryResponse = (response = {}) => {
    const defaultResponse = {
      watchHistoryItems: []
    };
    server.respondWith('GET', `${API_ROOT}/watch/:id/history`, mockResponse(defaultResponse, response));
  };

  const setLoadWatchHistoryItemResponse = (response = {}) => {
    const defaultResponse = {
      watchHistoryItem: {}
    };
    server.respondWith('GET', `${API_ROOT}/history/:id`, mockResponse(defaultResponse, response));
  };

  const setDeleteWatchResponse = (response, error) => {
    const status = error ? error.status || 400 : 200;
    const body = error ? JSON.stringify(error.body) : JSON.stringify(response);
    server.respondWith('POST', `${API_ROOT}/watches/delete`, [status, {
      'Content-Type': 'application/json'
    }, body]);
  };

  const setSaveWatchResponse = (id, response, error) => {
    const status = error ? error.status || 400 : 200;
    const body = error ? JSON.stringify(error.body) : JSON.stringify(response);
    server.respondWith('PUT', `${API_ROOT}/watch/${id}`, [status, {
      'Content-Type': 'application/json'
    }, body]);
  };

  const setLoadExecutionResultResponse = (response = {}) => {
    const defaultResponse = {
      watchHistoryItem: {}
    };
    server.respondWith('PUT', `${API_ROOT}/watch/execute`, mockResponse(defaultResponse, response));
  };

  const setLoadMatchingIndicesResponse = (response = {}) => {
    const defaultResponse = {
      indices: []
    };
    server.respondWith('POST', `${API_ROOT}/indices`, mockResponse(defaultResponse, response));
  };

  const setLoadEsFieldsResponse = (response = {}) => {
    const defaultResponse = {
      fields: []
    };
    server.respondWith('POST', `${API_ROOT}/fields`, mockResponse(defaultResponse, response));
  };

  const setLoadSettingsResponse = (response = {}) => {
    const defaultResponse = {
      action_types: {}
    };
    server.respondWith('GET', `${API_ROOT}/settings`, mockResponse(defaultResponse, response));
  };

  const setLoadWatchVisualizeResponse = (response = {}) => {
    const defaultResponse = {
      visualizeData: {}
    };
    server.respondWith('POST', `${API_ROOT}/watch/visualize`, mockResponse(defaultResponse, response));
  };

  const setDeactivateWatchResponse = (response = {}) => {
    const defaultResponse = {
      watchStatus: {}
    };
    server.respondWith('PUT', `${API_ROOT}/watch/:id/deactivate`, mockResponse(defaultResponse, response));
  };

  const setActivateWatchResponse = (response = {}) => {
    const defaultResponse = {
      watchStatus: {}
    };
    server.respondWith('PUT', `${API_ROOT}/watch/:id/activate`, mockResponse(defaultResponse, response));
  };

  const setAcknowledgeWatchResponse = (response = {}) => {
    const defaultResponse = {
      watchStatus: {}
    };
    server.respondWith('PUT', `${API_ROOT}/watch/:id/action/:actionId/acknowledge`, mockResponse(defaultResponse, response));
  };

  return {
    setLoadWatchesResponse,
    setLoadWatchResponse,
    setLoadWatchHistoryResponse,
    setLoadWatchHistoryItemResponse,
    setDeleteWatchResponse,
    setSaveWatchResponse,
    setLoadExecutionResultResponse,
    setLoadMatchingIndicesResponse,
    setLoadEsFieldsResponse,
    setLoadSettingsResponse,
    setLoadWatchVisualizeResponse,
    setDeactivateWatchResponse,
    setActivateWatchResponse,
    setAcknowledgeWatchResponse
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