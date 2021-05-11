"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CodePlugin = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Represents Code Plugin instance that will be managed by the Kibana plugin system.
 */

class CodePlugin {
  constructor(initializerContext) {
    this.initializerContext = initializerContext;
  }

  async setup() {
    const config = this.initializerContext.config.get();

    if (config && Object.keys(config).length > 0) {
      this.initializerContext.logger.get('config', 'deprecation').warn('The experimental app "Code" has been removed from Kibana. Remove all xpack.code.* ' + 'configurations from kibana.yml so Kibana does not fail to start up in the next major version.');
    }
  }

  start() {}

  stop() {}

}

exports.CodePlugin = CodePlugin;