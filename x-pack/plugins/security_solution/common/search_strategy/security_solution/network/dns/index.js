"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NetworkDnsFields = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

let NetworkDnsFields;
exports.NetworkDnsFields = NetworkDnsFields;

(function (NetworkDnsFields) {
  NetworkDnsFields["dnsName"] = "dnsName";
  NetworkDnsFields["queryCount"] = "queryCount";
  NetworkDnsFields["uniqueDomains"] = "uniqueDomains";
  NetworkDnsFields["dnsBytesIn"] = "dnsBytesIn";
  NetworkDnsFields["dnsBytesOut"] = "dnsBytesOut";
})(NetworkDnsFields || (exports.NetworkDnsFields = NetworkDnsFields = {}));