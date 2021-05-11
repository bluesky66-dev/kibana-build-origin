"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createDashboardSavedObjectType = void 0;

var _dashboard_migrations = require("./dashboard_migrations");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const createDashboardSavedObjectType = ({
  migrationDeps
}) => ({
  name: 'dashboard',
  hidden: false,
  namespaceType: 'single',
  management: {
    icon: 'dashboardApp',
    defaultSearchField: 'title',
    importableAndExportable: true,

    getTitle(obj) {
      return obj.attributes.title;
    },

    getEditUrl(obj) {
      return `/management/kibana/objects/savedDashboards/${encodeURIComponent(obj.id)}`;
    },

    getInAppUrl(obj) {
      return {
        path: `/app/dashboards#/view/${encodeURIComponent(obj.id)}`,
        uiCapabilitiesPath: 'dashboard.show'
      };
    }

  },
  mappings: {
    properties: {
      description: {
        type: 'text'
      },
      hits: {
        type: 'integer',
        index: false,
        doc_values: false
      },
      kibanaSavedObjectMeta: {
        properties: {
          searchSourceJSON: {
            type: 'text',
            index: false
          }
        }
      },
      optionsJSON: {
        type: 'text',
        index: false
      },
      panelsJSON: {
        type: 'text',
        index: false
      },
      refreshInterval: {
        properties: {
          display: {
            type: 'keyword',
            index: false,
            doc_values: false
          },
          pause: {
            type: 'boolean',
            index: false,
            doc_values: false
          },
          section: {
            type: 'integer',
            index: false,
            doc_values: false
          },
          value: {
            type: 'integer',
            index: false,
            doc_values: false
          }
        }
      },
      timeFrom: {
        type: 'keyword',
        index: false,
        doc_values: false
      },
      timeRestore: {
        type: 'boolean',
        index: false,
        doc_values: false
      },
      timeTo: {
        type: 'keyword',
        index: false,
        doc_values: false
      },
      title: {
        type: 'text'
      },
      version: {
        type: 'integer'
      }
    }
  },
  migrations: (0, _dashboard_migrations.createDashboardSavedObjectTypeMigrations)(migrationDeps)
});

exports.createDashboardSavedObjectType = createDashboardSavedObjectType;