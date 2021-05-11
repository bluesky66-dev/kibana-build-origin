"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createUptimeESClient = createUptimeESClient;
exports.debugESCall = debugESCall;

var _chalk = _interopRequireDefault(require("chalk"));

var _saved_objects = require("./saved_objects");

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


function createUptimeESClient({
  esClient,
  request,
  savedObjectsClient
}) {
  var _ref;

  const {
    _debug = false
  } = (_ref = request === null || request === void 0 ? void 0 : request.query) !== null && _ref !== void 0 ? _ref : {};
  return {
    baseESClient: esClient,

    async search(params) {
      let res;
      let esError;
      const dynamicSettings = await _saved_objects.savedObjectsAdapter.getUptimeDynamicSettings(savedObjectsClient);
      const esParams = {
        index: dynamicSettings.heartbeatIndices,
        ...params
      };
      const startTime = process.hrtime();

      try {
        res = await esClient.search(esParams);
      } catch (e) {
        esError = e;
      }

      if (_debug && request) {
        debugESCall({
          startTime,
          request,
          esError,
          operationName: 'search',
          params: esParams
        });
      }

      if (esError) {
        throw esError;
      }

      return res;
    },

    async count(params) {
      let res;
      let esError;
      const dynamicSettings = await _saved_objects.savedObjectsAdapter.getUptimeDynamicSettings(savedObjectsClient);
      const esParams = {
        index: dynamicSettings.heartbeatIndices,
        ...params
      };
      const startTime = process.hrtime();

      try {
        res = await esClient.count(esParams);
      } catch (e) {
        esError = e;
      }

      if (_debug && request) {
        debugESCall({
          startTime,
          request,
          esError,
          operationName: 'count',
          params: esParams
        });
      }

      if (esError) {
        throw esError;
      }

      return res;
    },

    getSavedObjectsClient() {
      return savedObjectsClient;
    }

  };
}
/* eslint-disable no-console */


function formatObj(obj) {
  return JSON.stringify(obj);
}

function debugESCall({
  operationName,
  params,
  request,
  esError,
  startTime
}) {
  const highlightColor = esError ? 'bgRed' : 'inverse';
  const diff = process.hrtime(startTime);
  const duration = `${Math.round(diff[0] * 1000 + diff[1] / 1e6)}ms`;
  const routeInfo = `${request.route.method.toUpperCase()} ${request.route.path}`;
  console.log(_chalk.default.bold[highlightColor](`=== Debug: ${routeInfo} (${duration}) ===`));

  if (operationName === 'search') {
    console.log(`GET ${params.index}/_${operationName}`);
    console.log(formatObj(params.body));
  } else {
    console.log(_chalk.default.bold('ES operation:'), operationName);
    console.log(_chalk.default.bold('ES query:'));
    console.log(formatObj(params));
  }

  console.log(`\n`);
}