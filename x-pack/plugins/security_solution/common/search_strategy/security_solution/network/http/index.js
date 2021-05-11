"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NetworkHttpFields = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

let NetworkHttpFields;
exports.NetworkHttpFields = NetworkHttpFields;

(function (NetworkHttpFields) {
  NetworkHttpFields["domains"] = "domains";
  NetworkHttpFields["lastHost"] = "lastHost";
  NetworkHttpFields["lastSourceIp"] = "lastSourceIp";
  NetworkHttpFields["methods"] = "methods";
  NetworkHttpFields["path"] = "path";
  NetworkHttpFields["requestCount"] = "requestCount";
  NetworkHttpFields["statuses"] = "statuses";
})(NetworkHttpFields || (exports.NetworkHttpFields = NetworkHttpFields = {}));