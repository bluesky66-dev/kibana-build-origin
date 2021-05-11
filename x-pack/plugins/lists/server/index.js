"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "ListClient", {
  enumerable: true,
  get: function () {
    return _list_client.ListClient;
  }
});
Object.defineProperty(exports, "CreateExceptionListItemOptions", {
  enumerable: true,
  get: function () {
    return _exception_list_client_types.CreateExceptionListItemOptions;
  }
});
Object.defineProperty(exports, "ExceptionListClient", {
  enumerable: true,
  get: function () {
    return _exception_list_client.ExceptionListClient;
  }
});
exports.plugin = exports.config = void 0;

var _config = require("./config");

var _plugin = require("./plugin");

var _list_client = require("./services/lists/list_client");

var _exception_list_client_types = require("./services/exception_lists/exception_list_client_types");

var _exception_list_client = require("./services/exception_lists/exception_list_client");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// exporting these since its required at top level in siem plugin


const config = {
  schema: _config.ConfigSchema
};
exports.config = config;

const plugin = initializerContext => new _plugin.ListPlugin(initializerContext);

exports.plugin = plugin;