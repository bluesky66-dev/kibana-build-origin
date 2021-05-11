"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UMKibanaBackendFrameworkAdapter = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

class UMKibanaBackendFrameworkAdapter {
  constructor(server) {
    this.server = server;
    this.server = server;
  }

  registerRoute({
    handler,
    method,
    options,
    path,
    validate
  }) {
    const routeDefinition = {
      path,
      validate,
      options
    };

    switch (method) {
      case 'GET':
        this.server.router.get(routeDefinition, handler);
        break;

      case 'POST':
        this.server.router.post(routeDefinition, handler);
        break;

      default:
        throw new Error(`Handler for method ${method} is not defined`);
    }
  }

}

exports.UMKibanaBackendFrameworkAdapter = UMKibanaBackendFrameworkAdapter;