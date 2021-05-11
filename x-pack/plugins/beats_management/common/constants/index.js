"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "UNIQUENESS_ENFORCING_TYPES", {
  enumerable: true,
  get: function () {
    return _configuration_blocks.UNIQUENESS_ENFORCING_TYPES;
  }
});
Object.defineProperty(exports, "INDEX_NAMES", {
  enumerable: true,
  get: function () {
    return _index_names.INDEX_NAMES;
  }
});
Object.defineProperty(exports, "PLUGIN", {
  enumerable: true,
  get: function () {
    return _plugin.PLUGIN;
  }
});
Object.defineProperty(exports, "MANAGEMENT_SECTION", {
  enumerable: true,
  get: function () {
    return _plugin.MANAGEMENT_SECTION;
  }
});
Object.defineProperty(exports, "LICENSES", {
  enumerable: true,
  get: function () {
    return _security.LICENSES;
  }
});
Object.defineProperty(exports, "REQUIRED_LICENSES", {
  enumerable: true,
  get: function () {
    return _security.REQUIRED_LICENSES;
  }
});
Object.defineProperty(exports, "REQUIRED_ROLES", {
  enumerable: true,
  get: function () {
    return _security.REQUIRED_ROLES;
  }
});
Object.defineProperty(exports, "TABLE_CONFIG", {
  enumerable: true,
  get: function () {
    return _table.TABLE_CONFIG;
  }
});
exports.BASE_PATH = void 0;

var _configuration_blocks = require("./configuration_blocks");

var _index_names = require("./index_names");

var _plugin = require("./plugin");

var _security = require("./security");

var _table = require("./table");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const BASE_PATH = '/management/ingest/beats_management';
exports.BASE_PATH = BASE_PATH;