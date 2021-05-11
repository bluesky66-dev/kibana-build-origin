"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerUiCounterSavedObjectType = registerUiCounterSavedObjectType;
exports.UI_COUNTER_SAVED_OBJECT_TYPE = void 0;

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const UI_COUNTER_SAVED_OBJECT_TYPE = 'ui-counter';
exports.UI_COUNTER_SAVED_OBJECT_TYPE = UI_COUNTER_SAVED_OBJECT_TYPE;

function registerUiCounterSavedObjectType(savedObjectsSetup) {
  savedObjectsSetup.registerType({
    name: UI_COUNTER_SAVED_OBJECT_TYPE,
    hidden: false,
    namespaceType: 'agnostic',
    mappings: {
      properties: {
        count: {
          type: 'integer'
        }
      }
    }
  });
}