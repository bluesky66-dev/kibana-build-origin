"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.plugin = exports.config = void 0;

var _common = require("../common");

var _plugin = require("./plugin");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const config = {
  schema: _common.beatsManagementConfigSchema,
  exposeToBrowser: {
    defaultUserRoles: true,
    encryptionKey: true,
    enrollmentTokensTtlInSeconds: true
  }
};
exports.config = config;

const plugin = context => new _plugin.BeatsManagementPlugin(context);

exports.plugin = plugin;