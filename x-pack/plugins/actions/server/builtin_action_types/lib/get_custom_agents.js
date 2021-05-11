"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCustomAgents = getCustomAgents;

var _https = require("https");

var _httpProxyAgent = _interopRequireDefault(require("http-proxy-agent"));

var _httpsProxyAgent = require("https-proxy-agent");

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


function getCustomAgents(configurationUtilities, logger) {
  const proxySettings = configurationUtilities.getProxySettings();
  const defaultAgents = {
    httpAgent: undefined,
    httpsAgent: new _https.Agent({
      rejectUnauthorized: configurationUtilities.isRejectUnauthorizedCertificatesEnabled()
    })
  };

  if (!proxySettings) {
    return defaultAgents;
  }

  logger.debug(`Creating proxy agents for proxy: ${proxySettings.proxyUrl}`);
  let proxyUrl;

  try {
    proxyUrl = new URL(proxySettings.proxyUrl);
  } catch (err) {
    logger.warn(`invalid proxy URL "${proxySettings.proxyUrl}" ignored`);
    return defaultAgents;
  }

  const httpAgent = new _httpProxyAgent.default(proxySettings.proxyUrl);
  const httpsAgent = new _httpsProxyAgent.HttpsProxyAgent({
    host: proxyUrl.hostname,
    port: Number(proxyUrl.port),
    protocol: proxyUrl.protocol,
    headers: proxySettings.proxyHeaders,
    // do not fail on invalid certs if value is false
    rejectUnauthorized: proxySettings.proxyRejectUnauthorizedCertificates
  }); // vsCode wasn't convinced HttpsProxyAgent is an https.Agent, so we convinced it

  return {
    httpAgent,
    httpsAgent
  };
}