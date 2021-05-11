"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.startServers = startServers;
exports.getServices = getServices;
exports.stopServers = stopServers;

var _kbn_server = require("../../../../test_helpers/kbn_server");

var _http_server = require("../../../http/http_server.mocks");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
let servers;
let esServer;
let kbn;
let kbnServer;
let services;

async function startServers() {
  servers = (0, _kbn_server.createTestServers)({
    adjustTimeout: t => jest.setTimeout(t),
    settings: {
      kbn: {
        uiSettings: {
          overrides: {
            foo: 'bar'
          }
        }
      }
    }
  });
  esServer = await servers.startES();
  kbn = await servers.startKibana();
  kbnServer = kbn.kbnServer;
}

function getServices() {
  if (services) {
    return services;
  }

  const callCluster = esServer.es.getCallCluster();
  const savedObjectsClient = kbn.coreStart.savedObjects.getScopedClient(_http_server.httpServerMock.createKibanaRequest());
  const uiSettings = kbnServer.newPlatform.start.core.uiSettings.asScopedToClient(savedObjectsClient);
  services = {
    kbnServer,
    callCluster,
    savedObjectsClient,
    uiSettings
  };
  return services;
}

async function stopServers() {
  services = null;
  kbnServer = null;

  if (servers) {
    await esServer.stop();
    await kbn.stop();
  }
}