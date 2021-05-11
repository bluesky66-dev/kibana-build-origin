"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FlowTargetSourceDest = exports.FlowTarget = exports.NetworkTopTablesFields = exports.NetworkDirectionEcs = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

let NetworkDirectionEcs;
exports.NetworkDirectionEcs = NetworkDirectionEcs;

(function (NetworkDirectionEcs) {
  NetworkDirectionEcs["inbound"] = "inbound";
  NetworkDirectionEcs["outbound"] = "outbound";
  NetworkDirectionEcs["internal"] = "internal";
  NetworkDirectionEcs["external"] = "external";
  NetworkDirectionEcs["incoming"] = "incoming";
  NetworkDirectionEcs["outgoing"] = "outgoing";
  NetworkDirectionEcs["listening"] = "listening";
  NetworkDirectionEcs["unknown"] = "unknown";
})(NetworkDirectionEcs || (exports.NetworkDirectionEcs = NetworkDirectionEcs = {}));

let NetworkTopTablesFields;
exports.NetworkTopTablesFields = NetworkTopTablesFields;

(function (NetworkTopTablesFields) {
  NetworkTopTablesFields["bytes_in"] = "bytes_in";
  NetworkTopTablesFields["bytes_out"] = "bytes_out";
  NetworkTopTablesFields["flows"] = "flows";
  NetworkTopTablesFields["destination_ips"] = "destination_ips";
  NetworkTopTablesFields["source_ips"] = "source_ips";
})(NetworkTopTablesFields || (exports.NetworkTopTablesFields = NetworkTopTablesFields = {}));

let FlowTarget;
exports.FlowTarget = FlowTarget;

(function (FlowTarget) {
  FlowTarget["client"] = "client";
  FlowTarget["destination"] = "destination";
  FlowTarget["server"] = "server";
  FlowTarget["source"] = "source";
})(FlowTarget || (exports.FlowTarget = FlowTarget = {}));

let FlowTargetSourceDest;
exports.FlowTargetSourceDest = FlowTargetSourceDest;

(function (FlowTargetSourceDest) {
  FlowTargetSourceDest["destination"] = "destination";
  FlowTargetSourceDest["source"] = "source";
})(FlowTargetSourceDest || (exports.FlowTargetSourceDest = FlowTargetSourceDest = {}));