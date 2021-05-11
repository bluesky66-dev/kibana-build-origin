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
// Register helpers to mock HTTP Requests


const registerHttpRequestMockHelpers = server => {
  const setLoadTemplatesResponse = (response = []) => {
    server.respondWith('GET', `${_constants.API_BASE_PATH}/index_templates`, [200, {
      'Content-Type': 'application/json'
    }, JSON.stringify(response)]);
  };

  const setLoadIndicesResponse = (response = []) => {
    server.respondWith('GET', `${_constants.API_BASE_PATH}/indices`, [200, {
      'Content-Type': 'application/json'
    }, JSON.stringify(response)]);
  };

  const setLoadDataStreamsResponse = (response = []) => {
    server.respondWith('GET', `${_constants.API_BASE_PATH}/data_streams`, [200, {
      'Content-Type': 'application/json'
    }, JSON.stringify(response)]);
  };

  const setLoadDataStreamResponse = (response = []) => {
    server.respondWith('GET', `${_constants.API_BASE_PATH}/data_streams/:id`, [200, {
      'Content-Type': 'application/json'
    }, JSON.stringify(response)]);
  };

  const setDeleteDataStreamResponse = (response = []) => {
    server.respondWith('POST', `${_constants.API_BASE_PATH}/delete_data_streams`, [200, {
      'Content-Type': 'application/json'
    }, JSON.stringify(response)]);
  };

  const setDeleteTemplateResponse = (response = []) => {
    server.respondWith('POST', `${_constants.API_BASE_PATH}/delete_index_templates`, [200, {
      'Content-Type': 'application/json'
    }, JSON.stringify(response)]);
  };

  const setLoadTemplateResponse = (response, error) => {
    const status = error ? error.status || 400 : 200;
    const body = error ? error.body : response;
    server.respondWith('GET', `${_constants.API_BASE_PATH}/index_templates/:id`, [status, {
      'Content-Type': 'application/json'
    }, JSON.stringify(body)]);
  };

  const setCreateTemplateResponse = (response, error) => {
    const status = error ? error.body.status || 400 : 200;
    const body = error ? JSON.stringify(error.body) : JSON.stringify(response);
    server.respondWith('POST', `${_constants.API_BASE_PATH}/index_templates`, [status, {
      'Content-Type': 'application/json'
    }, body]);
  };

  const setUpdateTemplateResponse = (response, error) => {
    const status = error ? error.status || 400 : 200;
    const body = error ? JSON.stringify(error.body) : JSON.stringify(response);
    server.respondWith('PUT', `${_constants.API_BASE_PATH}/index_templates/:name`, [status, {
      'Content-Type': 'application/json'
    }, body]);
  };

  const setSimulateTemplateResponse = (response, error) => {
    const status = error ? error.status || 400 : 200;
    const body = error ? JSON.stringify(error.body) : JSON.stringify(response);
    server.respondWith('POST', `${_constants.API_BASE_PATH}/index_templates/simulate`, [status, {
      'Content-Type': 'application/json'
    }, body]);
  };

  const setLoadComponentTemplatesResponse = (response, error) => {
    const status = error ? error.status || 400 : 200;
    const body = error ? error.body : response;
    server.respondWith('GET', `${_constants.API_BASE_PATH}/component_templates`, [status, {
      'Content-Type': 'application/json'
    }, JSON.stringify(body)]);
  };

  return {
    setLoadTemplatesResponse,
    setLoadIndicesResponse,
    setLoadDataStreamsResponse,
    setLoadDataStreamResponse,
    setDeleteDataStreamResponse,
    setDeleteTemplateResponse,
    setLoadTemplateResponse,
    setCreateTemplateResponse,
    setUpdateTemplateResponse,
    setSimulateTemplateResponse,
    setLoadComponentTemplatesResponse
  };
};

const init = () => {
  const server = _sinon.default.fakeServer.create();

  server.respondImmediately = true; // Define default response for unhandled requests.
  // We make requests to APIs which don't impact the component under test, e.g. UI metric telemetry,
  // and we can mock them all with a 200 instead of mocking each one individually.

  server.respondWith([200, {}, 'DefaultSinonMockServerResponse']);
  const httpRequestsMockHelpers = registerHttpRequestMockHelpers(server);
  return {
    server,
    httpRequestsMockHelpers
  };
};

exports.init = init;