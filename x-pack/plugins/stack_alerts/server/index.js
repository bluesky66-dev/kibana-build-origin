"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "INDEX_THRESHOLD_ID", {
  enumerable: true,
  get: function () {
    return _alert_type.ID;
  }
});
exports.plugin = exports.config = void 0;

var _plugin = require("./plugin");

var _config = require("../common/config");

var _alert_type = require("./alert_types/index_threshold/alert_type");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const config = {
  exposeToBrowser: {},
  schema: _config.configSchema
};
exports.config = config;

const plugin = ctx => new _plugin.AlertingBuiltinsPlugin(ctx);

exports.plugin = plugin;