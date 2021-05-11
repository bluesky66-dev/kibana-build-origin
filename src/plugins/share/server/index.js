"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.plugin = plugin;
Object.defineProperty(exports, "CSV_QUOTE_VALUES_SETTING", {
  enumerable: true,
  get: function () {
    return _constants.CSV_QUOTE_VALUES_SETTING;
  }
});
Object.defineProperty(exports, "CSV_SEPARATOR_SETTING", {
  enumerable: true,
  get: function () {
    return _constants.CSV_SEPARATOR_SETTING;
  }
});

var _plugin = require("./plugin");

var _constants = require("../common/constants");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function plugin(initializerContext) {
  return new _plugin.SharePlugin(initializerContext);
}