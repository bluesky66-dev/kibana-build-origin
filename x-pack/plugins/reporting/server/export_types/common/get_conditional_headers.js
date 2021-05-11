"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getConditionalHeaders = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getConditionalHeaders = (config, filteredHeaders) => {
  const {
    kbnConfig
  } = config;
  const [hostname, port, basePath, protocol] = [config.get('kibanaServer', 'hostname'), config.get('kibanaServer', 'port'), kbnConfig.get('server', 'basePath'), config.get('kibanaServer', 'protocol')];
  const conditionalHeaders = {
    headers: filteredHeaders,
    conditions: {
      hostname: hostname ? hostname.toLowerCase() : hostname,
      port,
      basePath,
      protocol
    }
  };
  return conditionalHeaders;
};

exports.getConditionalHeaders = getConditionalHeaders;