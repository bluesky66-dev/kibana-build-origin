"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.uiSettingsType = void 0;

var _migrations = require("./migrations");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const uiSettingsType = {
  name: 'config',
  hidden: false,
  namespaceType: 'single',
  mappings: {
    dynamic: false,
    properties: {
      buildNum: {
        type: 'keyword'
      }
    }
  },
  management: {
    importableAndExportable: true,

    getInAppUrl() {
      return {
        path: `/app/management/kibana/settings`,
        uiCapabilitiesPath: 'advancedSettings.show'
      };
    },

    getTitle(obj) {
      return `Advanced Settings [${obj.id}]`;
    }

  },
  migrations: _migrations.migrations
};
exports.uiSettingsType = uiSettingsType;