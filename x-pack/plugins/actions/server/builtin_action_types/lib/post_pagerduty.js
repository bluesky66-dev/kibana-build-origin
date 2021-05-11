"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.postPagerduty = postPagerduty;

var _axios = _interopRequireDefault(require("axios"));

var _axios_utils = require("./axios_utils");

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// post an event to pagerduty


async function postPagerduty(options, logger, configurationUtilities) {
  const {
    apiUrl,
    data,
    headers
  } = options;

  const axiosInstance = _axios.default.create();

  return await (0, _axios_utils.request)({
    axios: axiosInstance,
    url: apiUrl,
    method: 'post',
    logger,
    data,
    headers,
    configurationUtilities,
    validateStatus: () => true
  });
}