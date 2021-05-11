"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.plugin = exports.config = void 0;

var _config = require("../../maps_legacy/config");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const config = {
  exposeToBrowser: {
    url: true,
    options: true
  },
  schema: _config.tilemapConfigSchema
};
exports.config = config;

const plugin = () => ({
  setup() {},

  start() {}

});

exports.plugin = plugin;