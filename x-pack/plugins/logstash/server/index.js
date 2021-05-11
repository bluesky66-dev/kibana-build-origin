"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.config = exports.plugin = void 0;

var _configSchema = require("@kbn/config-schema");

var _plugin = require("./plugin");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const plugin = context => new _plugin.LogstashPlugin(context);

exports.plugin = plugin;
const config = {
  schema: _configSchema.schema.object({
    enabled: _configSchema.schema.boolean({
      defaultValue: true
    })
  })
};
exports.config = config;