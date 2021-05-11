"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.uptimeAlertWrapper = void 0;

var _saved_objects = require("../saved_objects");

var _lib = require("../lib");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const uptimeAlertWrapper = uptimeAlert => ({ ...uptimeAlert,
  producer: 'uptime',
  executor: async options => {
    const {
      services: {
        scopedClusterClient: esClient,
        savedObjectsClient
      }
    } = options;
    const dynamicSettings = await _saved_objects.savedObjectsAdapter.getUptimeDynamicSettings(options.services.savedObjectsClient);
    const uptimeEsClient = (0, _lib.createUptimeESClient)({
      esClient,
      savedObjectsClient
    });
    return uptimeAlert.executor({
      options,
      dynamicSettings,
      uptimeEsClient,
      savedObjectsClient
    });
  }
});

exports.uptimeAlertWrapper = uptimeAlertWrapper;