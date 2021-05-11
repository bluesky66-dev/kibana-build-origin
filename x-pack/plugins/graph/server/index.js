"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.config = exports.plugin = void 0;

var _config = require("../config");

var _plugin = require("./plugin");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const plugin = () => new _plugin.GraphPlugin();

exports.plugin = plugin;
const config = {
  exposeToBrowser: {
    canEditDrillDownUrls: true,
    savePolicy: true
  },
  schema: _config.configSchema
};
exports.config = config;