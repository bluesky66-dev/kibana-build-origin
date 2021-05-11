"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toAsyncKibanaSearchResponse = toAsyncKibanaSearchResponse;
exports.toEqlKibanaSearchResponse = toEqlKibanaSearchResponse;

var _server = require("../../../../../src/plugins/data/server");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Get the Kibana representation of an async search response (see `IKibanaSearchResponse`).
 */


function toAsyncKibanaSearchResponse(response) {
  return {
    id: response.id,
    rawResponse: response.response,
    isPartial: response.is_partial,
    isRunning: response.is_running,
    ...(0, _server.getTotalLoaded)(response.response)
  };
}
/**
 * Get the Kibana representation of an EQL search response (see `IKibanaSearchResponse`).
 * (EQL does not provide _shard info, so total/loaded cannot be calculated.)
 */


function toEqlKibanaSearchResponse(response) {
  return {
    id: response.body.id,
    rawResponse: response,
    isPartial: response.body.is_partial,
    isRunning: response.body.is_running
  };
}