"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.config = exports.plugin = void 0;

var _plugin = require("./plugin");

var _config = require("../common/config");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const plugin = ctx => {
  return new _plugin.UpgradeAssistantServerPlugin(ctx);
};

exports.plugin = plugin;
const config = {
  schema: _config.configSchema,
  exposeToBrowser: {
    enabled: true
  }
};
exports.config = config;