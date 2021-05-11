"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HostsFields = exports.HostPolicyResponseActionStatus = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

let HostPolicyResponseActionStatus;
exports.HostPolicyResponseActionStatus = HostPolicyResponseActionStatus;

(function (HostPolicyResponseActionStatus) {
  HostPolicyResponseActionStatus["success"] = "success";
  HostPolicyResponseActionStatus["failure"] = "failure";
  HostPolicyResponseActionStatus["warning"] = "warning";
})(HostPolicyResponseActionStatus || (exports.HostPolicyResponseActionStatus = HostPolicyResponseActionStatus = {}));

let HostsFields;
exports.HostsFields = HostsFields;

(function (HostsFields) {
  HostsFields["lastSeen"] = "lastSeen";
  HostsFields["hostName"] = "hostName";
})(HostsFields || (exports.HostsFields = HostsFields = {}));