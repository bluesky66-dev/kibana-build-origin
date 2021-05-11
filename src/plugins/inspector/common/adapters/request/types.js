"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RequestStatus = void 0;

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 * The status a request can have.
 */
let RequestStatus;
exports.RequestStatus = RequestStatus;

(function (RequestStatus) {
  RequestStatus[RequestStatus["PENDING"] = 0] = "PENDING";
  RequestStatus[RequestStatus["OK"] = 1] = "OK";
  RequestStatus[RequestStatus["ERROR"] = 2] = "ERROR";
})(RequestStatus || (exports.RequestStatus = RequestStatus = {}));