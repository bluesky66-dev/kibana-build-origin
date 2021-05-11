"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createSourcesResolvers = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const createSourcesResolvers = libs => ({
  Query: {
    async source(root, args) {
      const requestedSourceConfiguration = await libs.sources.getConfiguration(args.id);
      return {
        id: args.id,
        configuration: requestedSourceConfiguration
      };
    },

    async allSources() {
      const sourceConfigurations = await libs.sources.getAllConfigurations();
      return Object.entries(sourceConfigurations).map(([sourceName, sourceConfiguration]) => ({
        id: sourceName,
        configuration: sourceConfiguration
      }));
    }

  },
  Source: {
    async status(source) {
      return source;
    }

  }
});

exports.createSourcesResolvers = createSourcesResolvers;