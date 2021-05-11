"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setupEnvironment = void 0;

var _axios = _interopRequireDefault(require("axios"));

var _xhr = _interopRequireDefault(require("axios/lib/adapters/xhr"));

var _http_requests = require("./http_requests");

var _api = require("../../public/application/lib/api");

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


const mockHttpClient = _axios.default.create({
  adapter: _xhr.default
});

mockHttpClient.interceptors.response.use(res => {
  return res.data;
}, rej => {
  return Promise.reject(rej);
});

const mockSavedObjectsClient = () => {
  return {
    find: _params => {}
  };
};

const setupEnvironment = () => {
  const {
    server,
    httpRequestsMockHelpers
  } = (0, _http_requests.init)(); // @ts-ignore

  (0, _api.setHttpClient)(mockHttpClient);
  (0, _api.setSavedObjectsClient)(mockSavedObjectsClient());
  return {
    server,
    httpRequestsMockHelpers
  };
};

exports.setupEnvironment = setupEnvironment;