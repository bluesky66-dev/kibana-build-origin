"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ElasticsearchFeature = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Interface for registering an Elasticsearch feature.
 * Feature registration allows plugins to hide their applications based
 * on configured cluster or index privileges.
 */

class ElasticsearchFeature {
  constructor(config) {
    this.config = config;
  }

  get id() {
    return this.config.id;
  }

  get catalogue() {
    return this.config.catalogue;
  }

  get management() {
    return this.config.management;
  }

  get privileges() {
    return this.config.privileges;
  }

  toRaw() {
    return { ...this.config
    };
  }

}

exports.ElasticsearchFeature = ElasticsearchFeature;