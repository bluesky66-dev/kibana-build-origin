"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.coreMixin = coreMixin;

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 * Exposes `kbnServer.newPlatform` through Hapi API.
 * @param kbnServer KbnServer singleton instance.
 * @param server Hapi server instance to expose `core` on.
 */
function coreMixin(kbnServer, server) {
  // we suppress type error because hapi expect a function here not an object
  server.decorate('server', 'newPlatform', kbnServer.newPlatform);
}