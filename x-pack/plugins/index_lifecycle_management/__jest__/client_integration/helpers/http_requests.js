"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.init = void 0;

var _sinon = require("sinon");

var _constants = require("../../../common/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const init = () => {
  const server = _sinon.fakeServer.create();

  server.respondImmediately = true;
  server.respondWith([200, {}, 'DefaultServerResponse']);
  return {
    server,
    httpRequestsMockHelpers: registerHttpRequestMockHelpers(server)
  };
};

exports.init = init;

const registerHttpRequestMockHelpers = server => {
  const setLoadPolicies = (response = []) => {
    server.respondWith('GET', `${_constants.API_BASE_PATH}/policies`, [200, {
      'Content-Type': 'application/json'
    }, JSON.stringify(response)]);
  };

  const setLoadSnapshotPolicies = (response = [], error) => {
    const status = error ? error.status : 200;
    const body = error ? error.body : response;
    server.respondWith('GET', `${_constants.API_BASE_PATH}/snapshot_policies`, [status, {
      'Content-Type': 'application/json'
    }, JSON.stringify(body)]);
  };

  const setListNodes = body => {
    server.respondWith('GET', `${_constants.API_BASE_PATH}/nodes/list`, [200, {
      'Content-Type': 'application/json'
    }, JSON.stringify(body)]);
  };

  const setNodesDetails = (nodeAttributes, body) => {
    server.respondWith('GET', `${_constants.API_BASE_PATH}/nodes/${nodeAttributes}/details`, [200, {
      'Content-Type': 'application/json'
    }, JSON.stringify(body)]);
  };

  const setListSnapshotRepos = body => {
    server.respondWith('GET', `${_constants.API_BASE_PATH}/snapshot_repositories`, [200, {
      'Content-Type': 'application/json'
    }, JSON.stringify(body)]);
  };

  return {
    setLoadPolicies,
    setLoadSnapshotPolicies,
    setListNodes,
    setNodesDetails,
    setListSnapshotRepos
  };
};