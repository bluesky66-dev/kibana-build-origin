"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "ConfigurationSourcesAdapter", {
  enumerable: true,
  get: function () {
    return _configuration.ConfigurationSourcesAdapter;
  }
});
exports.Sources = void 0;

var _configuration = require("./configuration");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


class Sources {
  constructor(adapter) {
    this.adapter = adapter;
  }

  async getConfiguration(sourceId) {
    const sourceConfigurations = await this.getAllConfigurations();
    const requestedSourceConfiguration = sourceConfigurations[sourceId];

    if (!requestedSourceConfiguration) {
      throw new Error(`Failed to find source '${sourceId}'`);
    }

    return requestedSourceConfiguration;
  }

  getAllConfigurations() {
    return this.adapter.getAll();
  }

}

exports.Sources = Sources;