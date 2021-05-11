"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.loggingMixin = loggingMixin;

var _legacyLogging = require("@kbn/legacy-logging");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
async function loggingMixin(kbnServer, server, config) {
  server.decorate('server', 'logWithMetadata', (tags, message, metadata = {}) => {
    server.log(tags, (0, _legacyLogging.attachMetaData)(message, metadata));
  });
  const loggingConfig = config.get('logging');
  const opsInterval = config.get('ops.interval');
  await (0, _legacyLogging.setupLogging)(server, loggingConfig, opsInterval);
  await (0, _legacyLogging.setupLoggingRotate)(server, loggingConfig);
}