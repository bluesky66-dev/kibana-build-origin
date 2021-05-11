"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setupSavedObjects = setupSavedObjects;

var _common = require("../common");

var _migrations = require("./migrations");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function setupSavedObjects(core) {
  core.savedObjects.registerType({
    name: 'lens',
    hidden: false,
    namespaceType: 'single',
    management: {
      icon: 'lensApp',
      defaultSearchField: 'title',
      importableAndExportable: true,
      getTitle: obj => obj.attributes.title,
      getInAppUrl: obj => ({
        path: `/app/lens${(0, _common.getEditPath)(obj.id)}`,
        uiCapabilitiesPath: 'visualize.show'
      })
    },
    migrations: _migrations.migrations,
    mappings: {
      properties: {
        title: {
          type: 'text'
        },
        description: {
          type: 'text'
        },
        visualizationType: {
          type: 'keyword'
        },
        state: {
          type: 'flattened'
        },
        expression: {
          index: false,
          doc_values: false,
          type: 'keyword'
        }
      }
    }
  });
  core.savedObjects.registerType({
    name: 'lens-ui-telemetry',
    hidden: false,
    namespaceType: 'single',
    mappings: {
      properties: {
        name: {
          type: 'keyword'
        },
        type: {
          type: 'keyword'
        },
        date: {
          type: 'date'
        },
        count: {
          type: 'integer'
        }
      }
    }
  });
}