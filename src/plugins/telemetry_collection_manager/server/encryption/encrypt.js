"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getKID = getKID;
exports.encryptTelemetry = encryptTelemetry;

var _requestCrypto = require("@elastic/request-crypto");

var _telemetry_jwks = require("./telemetry_jwks");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function getKID(useProdKey = false) {
  return useProdKey ? 'kibana1' : 'kibana_dev1';
}

async function encryptTelemetry(payload, {
  useProdKey = false
} = {}) {
  const kid = getKID(useProdKey);
  const encryptor = await (0, _requestCrypto.createRequestEncryptor)(_telemetry_jwks.telemetryJWKS);
  const clusters = [].concat(payload);
  return Promise.all(clusters.map(cluster => encryptor.encrypt(kid, cluster)));
}