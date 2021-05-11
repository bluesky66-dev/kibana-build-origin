"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerCoreObjectTypes = registerCoreObjectTypes;

var _constants = require("./constants");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const legacyUrlAliasType = {
  name: _constants.LEGACY_URL_ALIAS_TYPE,
  namespaceType: 'agnostic',
  mappings: {
    dynamic: false,
    // we aren't querying or aggregating over this data, so we don't need to specify any fields
    properties: {}
  },
  hidden: true
};
/**
 * @internal
 */

function registerCoreObjectTypes(typeRegistry) {
  typeRegistry.registerType(legacyUrlAliasType);
}