"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  EndpointStatus: true,
  HostStatus: true,
  MetadataQueryStrategyVersions: true,
  ProtectionModes: true,
  HostPolicyResponseActionStatus: true
};
exports.HostPolicyResponseActionStatus = exports.ProtectionModes = exports.MetadataQueryStrategyVersions = exports.HostStatus = exports.EndpointStatus = void 0;

var _os = require("./os");

Object.keys(_os).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _os[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _os[key];
    }
  });
});

var _trusted_apps = require("./trusted_apps");

Object.keys(_trusted_apps).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _trusted_apps[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _trusted_apps[key];
    }
  });
});
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * The status of the Endpoint Agent as reported by the Agent or the
 * Security Solution app using events from Fleet.
 */

let EndpointStatus;
/**
 * The status of the host, which is mapped to the Elastic Agent status in Fleet
 */

exports.EndpointStatus = EndpointStatus;

(function (EndpointStatus) {
  EndpointStatus["enrolled"] = "enrolled";
  EndpointStatus["unenrolled"] = "unenrolled";
})(EndpointStatus || (exports.EndpointStatus = EndpointStatus = {}));

let HostStatus;
exports.HostStatus = HostStatus;

(function (HostStatus) {
  HostStatus["ERROR"] = "error";
  HostStatus["ONLINE"] = "online";
  HostStatus["OFFLINE"] = "offline";
  HostStatus["UNENROLLING"] = "unenrolling";
})(HostStatus || (exports.HostStatus = HostStatus = {}));

let MetadataQueryStrategyVersions;
exports.MetadataQueryStrategyVersions = MetadataQueryStrategyVersions;

(function (MetadataQueryStrategyVersions) {
  MetadataQueryStrategyVersions["VERSION_1"] = "v1";
  MetadataQueryStrategyVersions["VERSION_2"] = "v2";
})(MetadataQueryStrategyVersions || (exports.MetadataQueryStrategyVersions = MetadataQueryStrategyVersions = {}));
/** Policy protection mode options */


let ProtectionModes;
/**
 * Endpoint Policy data, which extends Ingest's `PackagePolicy` type
 */

exports.ProtectionModes = ProtectionModes;

(function (ProtectionModes) {
  ProtectionModes["detect"] = "detect";
  ProtectionModes["prevent"] = "prevent";
  ProtectionModes["off"] = "off";
})(ProtectionModes || (exports.ProtectionModes = ProtectionModes = {}));
/**
 * the possible status for actions, configurations and overall Policy Response
 */


let HostPolicyResponseActionStatus;
/**
 * The name of actions that can be applied during the processing of a policy
 */

exports.HostPolicyResponseActionStatus = HostPolicyResponseActionStatus;

(function (HostPolicyResponseActionStatus) {
  HostPolicyResponseActionStatus["success"] = "success";
  HostPolicyResponseActionStatus["failure"] = "failure";
  HostPolicyResponseActionStatus["warning"] = "warning";
  HostPolicyResponseActionStatus["unsupported"] = "unsupported";
})(HostPolicyResponseActionStatus || (exports.HostPolicyResponseActionStatus = HostPolicyResponseActionStatus = {}));