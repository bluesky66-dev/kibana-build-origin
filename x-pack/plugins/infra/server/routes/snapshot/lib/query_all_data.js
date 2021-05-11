"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.queryAllData = void 0;

var _metrics = require("../../../lib/metrics");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const handleResponse = (client, options, previousResponse) => async resp => {
  const combinedResponse = previousResponse ? { ...previousResponse,
    series: [...previousResponse.series, ...resp.series],
    info: resp.info
  } : resp;

  if (resp.info.afterKey) {
    return (0, _metrics.query)(client, { ...options,
      afterKey: resp.info.afterKey
    }).then(handleResponse(client, options, combinedResponse));
  }

  return combinedResponse;
};

const queryAllData = (client, options) => {
  return (0, _metrics.query)(client, options).then(handleResponse(client, options));
};

exports.queryAllData = queryAllData;