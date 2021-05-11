"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "initServerWithKibana", {
  enumerable: true,
  get: function () {
    return _kibana.initServerWithKibana;
  }
});
Object.defineProperty(exports, "KibanaServer", {
  enumerable: true,
  get: function () {
    return _kibana.KibanaServer;
  }
});
exports.plugin = void 0;

var _plugin = require("./plugin");

var _kibana = require("./kibana.index");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const plugin = initializerContext => new _plugin.Plugin(initializerContext);

exports.plugin = plugin;