"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.infraSourceConfigurationSavedObjectType = exports.infraSourceConfigurationSavedObjectName = void 0;

var _9_0_add_new_indexing_strategy_index_names = require("./migrations/7_9_0_add_new_indexing_strategy_index_names");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const infraSourceConfigurationSavedObjectName = 'infrastructure-ui-source';
exports.infraSourceConfigurationSavedObjectName = infraSourceConfigurationSavedObjectName;
const infraSourceConfigurationSavedObjectType = {
  name: infraSourceConfigurationSavedObjectName,
  hidden: false,
  namespaceType: 'single',
  management: {
    importableAndExportable: true
  },
  mappings: {
    dynamic: false,
    properties: {}
  },
  migrations: {
    '7.9.0': _9_0_add_new_indexing_strategy_index_names.addNewIndexingStrategyIndexNames
  }
};
exports.infraSourceConfigurationSavedObjectType = infraSourceConfigurationSavedObjectType;