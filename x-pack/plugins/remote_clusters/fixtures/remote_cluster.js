"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getRemoteClusterMock = void 0;

var _jest = require("@kbn/test/jest");

var _constants = require("../common/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const getRemoteClusterMock = ({
  name = (0, _jest.getRandomString)(),
  isConnected = true,
  connectedNodesCount = 1,
  connectedSocketsCount,
  seeds = ['localhost:9400'],
  isConfiguredByNode = false,
  mode = _constants.SNIFF_MODE,
  proxyAddress,
  hasDeprecatedProxySetting = false
} = {}) => ({
  name,
  seeds,
  isConnected,
  connectedNodesCount,
  isConfiguredByNode,
  maxConnectionsPerCluster: 3,
  initialConnectTimeout: '30s',
  skipUnavailable: false,
  mode,
  connectedSocketsCount,
  proxyAddress,
  hasDeprecatedProxySetting
});

exports.getRemoteClusterMock = getRemoteClusterMock;