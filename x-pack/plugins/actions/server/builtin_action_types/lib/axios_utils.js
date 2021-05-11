"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getErrorMessage = exports.addTimeZoneToDate = exports.patch = exports.request = void 0;

var _get_custom_agents = require("./get_custom_agents");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const request = async ({
  axios,
  url,
  logger,
  method = 'get',
  data,
  configurationUtilities,
  ...rest
}) => {
  const {
    httpAgent,
    httpsAgent
  } = (0, _get_custom_agents.getCustomAgents)(configurationUtilities, logger);
  const {
    maxContentLength,
    timeout
  } = configurationUtilities.getResponseSettings();
  return await axios(url, { ...rest,
    method,
    data: data !== null && data !== void 0 ? data : {},
    // use httpAgent and httpsAgent and set axios proxy: false, to be able to handle fail on invalid certs
    httpAgent,
    httpsAgent,
    proxy: false,
    maxContentLength,
    timeout
  });
};

exports.request = request;

const patch = async ({
  axios,
  url,
  data,
  logger,
  configurationUtilities
}) => {
  return request({
    axios,
    url,
    logger,
    method: 'patch',
    data,
    configurationUtilities
  });
};

exports.patch = patch;

const addTimeZoneToDate = (date, timezone = 'GMT') => {
  return `${date} ${timezone}`;
};

exports.addTimeZoneToDate = addTimeZoneToDate;

const getErrorMessage = (connector, msg) => {
  return `[Action][${connector}]: ${msg}`;
};

exports.getErrorMessage = getErrorMessage;