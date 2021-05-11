"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getContextFactory = void 0;

var _rxjs = require("rxjs");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * {@link GlobalSearchProviderContext | context} factory
 */


const getContextFactory = coreStart => request => {
  const soClient = coreStart.savedObjects.getScopedClient(request);
  return {
    core: {
      savedObjects: {
        client: soClient,
        typeRegistry: coreStart.savedObjects.getTypeRegistry()
      },
      elasticsearch: {
        legacy: {
          client: coreStart.elasticsearch.legacy.client.asScoped(request)
        }
      },
      uiSettings: {
        client: coreStart.uiSettings.asScopedToClient(soClient)
      },
      capabilities: (0, _rxjs.from)(coreStart.capabilities.resolveCapabilities(request))
    }
  };
};

exports.getContextFactory = getContextFactory;