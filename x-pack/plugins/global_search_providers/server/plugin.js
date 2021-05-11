"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GlobalSearchProvidersPlugin = void 0;

var _providers = require("./providers");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


class GlobalSearchProvidersPlugin {
  setup({
    getStartServices
  }, {
    globalSearch
  }) {
    globalSearch.registerResultProvider((0, _providers.createSavedObjectsResultProvider)());
    return {};
  }

  start() {
    return {};
  }

}

exports.GlobalSearchProvidersPlugin = GlobalSearchProvidersPlugin;