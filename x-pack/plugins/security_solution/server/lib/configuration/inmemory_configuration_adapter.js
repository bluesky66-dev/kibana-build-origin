"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.InmemoryConfigurationAdapter = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

class InmemoryConfigurationAdapter {
  constructor(configuration) {
    this.configuration = configuration;
  }

  async get() {
    return this.configuration;
  }

}

exports.InmemoryConfigurationAdapter = InmemoryConfigurationAdapter;