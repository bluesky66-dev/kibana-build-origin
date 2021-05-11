"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.tx = void 0;

var _network_traffic_with_interfaces = require("../../../shared/metrics/snapshot/network_traffic_with_interfaces");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const tx = (0, _network_traffic_with_interfaces.networkTrafficWithInterfaces)('tx', 'system.network.out.bytes', 'system.network.name');
exports.tx = tx;