"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.savedObjectsAdapter = exports.umDynamicSettings = exports.settingsObjectId = exports.settingsObjectType = void 0;

var _constants = require("../../common/constants");

var _server = require("../../../../../src/core/server");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const settingsObjectType = 'uptime-dynamic-settings';
exports.settingsObjectType = settingsObjectType;
const settingsObjectId = 'uptime-dynamic-settings-singleton';
exports.settingsObjectId = settingsObjectId;
const umDynamicSettings = {
  name: settingsObjectType,
  hidden: false,
  namespaceType: 'single',
  mappings: {
    dynamic: false,
    properties: {
      /* Leaving these commented to make it clear that these fields exist, even though we don't want them indexed.
         When adding new fields please add them here. If they need to be searchable put them in the uncommented
         part of properties.
      heartbeatIndices: {
        type: 'keyword',
      },
      certAgeThreshold: {
        type: 'long',
      },
      certExpirationThreshold: {
        type: 'long',
      },
      defaultConnectors: {
        type: 'keyword',
      },
      */
    }
  }
};
exports.umDynamicSettings = umDynamicSettings;
const savedObjectsAdapter = {
  getUptimeDynamicSettings: async client => {
    try {
      var _obj$attributes;

      const obj = await client.get(umDynamicSettings.name, settingsObjectId);
      return (_obj$attributes = obj === null || obj === void 0 ? void 0 : obj.attributes) !== null && _obj$attributes !== void 0 ? _obj$attributes : _constants.DYNAMIC_SETTINGS_DEFAULTS;
    } catch (getErr) {
      if (_server.SavedObjectsErrorHelpers.isNotFoundError(getErr)) {
        return _constants.DYNAMIC_SETTINGS_DEFAULTS;
      }

      throw getErr;
    }
  },
  setUptimeDynamicSettings: async (client, settings) => {
    await client.create(umDynamicSettings.name, settings, {
      id: settingsObjectId,
      overwrite: true
    });
  }
};
exports.savedObjectsAdapter = savedObjectsAdapter;