"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UPLOAD_LICENSE_TLS_NOT_ENABLED = exports.UPLOAD_LICENSE_INVALID = exports.UPLOAD_LICENSE_SUCCESS = exports.UPLOAD_LICENSE_REQUIRES_ACK = exports.UPLOAD_LICENSE_EXPIRED = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const UPLOAD_LICENSE_EXPIRED = [200, {
  'Content-Type': 'application/json'
}, '{"acknowledged": "true", "license_status": "expired"}'];
exports.UPLOAD_LICENSE_EXPIRED = UPLOAD_LICENSE_EXPIRED;
const UPLOAD_LICENSE_REQUIRES_ACK = [200, {
  'Content-Type': 'application/json'
}, `{
    "acknowledged":false,
    "license_status":"valid",
    "acknowledge":
      {
        "message": "This license update requires acknowledgement. To acknowledge the license, please read the following messages and update the license again, this time with the \\"acknowledge=true\\" parameter:",
        "watcher":["Watcher will be disabled"]
      }
    }`];
exports.UPLOAD_LICENSE_REQUIRES_ACK = UPLOAD_LICENSE_REQUIRES_ACK;
const UPLOAD_LICENSE_SUCCESS = [200, {
  'Content-Type': 'application/json'
}, '{"acknowledged": "true", "license_status": "valid"}'];
exports.UPLOAD_LICENSE_SUCCESS = UPLOAD_LICENSE_SUCCESS;
const UPLOAD_LICENSE_INVALID = [200, {
  'Content-Type': 'application/json'
}, '{"acknowledged": "true", "license_status": "invalid"}'];
exports.UPLOAD_LICENSE_INVALID = UPLOAD_LICENSE_INVALID;
const UPLOAD_LICENSE_TLS_NOT_ENABLED = [200, {
  'Content-Type': 'application/json'
}, `{
      "error":
      {
        "root_cause":
          [{
            "type":"illegal_state_exception",
            "reason":"Can not upgrade to a production license unless TLS is configured or security is disabled"
          }],"type":"illegal_state_exception",
          "reason":"Can not upgrade to a production license unless TLS is configured or security is disabled"},
          "status":500}
    `];
exports.UPLOAD_LICENSE_TLS_NOT_ENABLED = UPLOAD_LICENSE_TLS_NOT_ENABLED;