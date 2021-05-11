"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.libsMock = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const libsMock = {
  sources: {
    getSourceConfiguration: (savedObjectsClient, sourceId) => {
      return Promise.resolve({
        id: sourceId,
        configuration: {
          logAlias: 'filebeat-*',
          fields: {
            timestamp: '@timestamp'
          }
        }
      });
    }
  }
};
exports.libsMock = libsMock;