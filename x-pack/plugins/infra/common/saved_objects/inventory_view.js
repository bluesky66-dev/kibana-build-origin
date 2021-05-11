"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.inventoryViewSavedObjectType = exports.inventoryViewSavedObjectName = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// eslint-disable-next-line @kbn/eslint/no-restricted-paths

const inventoryViewSavedObjectName = 'inventory-view';
exports.inventoryViewSavedObjectName = inventoryViewSavedObjectName;
const inventoryViewSavedObjectType = {
  name: inventoryViewSavedObjectName,
  hidden: false,
  namespaceType: 'single',
  management: {
    importableAndExportable: true
  },
  mappings: {
    dynamic: false,
    properties: {}
  }
};
exports.inventoryViewSavedObjectType = inventoryViewSavedObjectType;