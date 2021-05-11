"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.graphWorkspace = void 0;

var _migrations = require("./migrations");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const graphWorkspace = {
  name: 'graph-workspace',
  namespaceType: 'single',
  hidden: false,
  management: {
    icon: 'graphApp',
    defaultSearchField: 'title',
    importableAndExportable: true,

    getTitle(obj) {
      return obj.attributes.title;
    },

    getInAppUrl(obj) {
      return {
        path: `/app/graph#/workspace/${encodeURIComponent(obj.id)}`,
        uiCapabilitiesPath: 'graph.show'
      };
    }

  },
  migrations: _migrations.graphMigrations,
  mappings: {
    properties: {
      description: {
        type: 'text'
      },
      kibanaSavedObjectMeta: {
        properties: {
          searchSourceJSON: {
            type: 'text'
          }
        }
      },
      numLinks: {
        type: 'integer'
      },
      numVertices: {
        type: 'integer'
      },
      title: {
        type: 'text'
      },
      version: {
        type: 'integer'
      },
      wsState: {
        type: 'text'
      },
      legacyIndexPatternRef: {
        type: 'text',
        index: false
      }
    }
  }
};
exports.graphWorkspace = graphWorkspace;