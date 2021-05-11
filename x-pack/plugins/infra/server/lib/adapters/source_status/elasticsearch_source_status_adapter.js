"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.InfraElasticsearchSourceStatusAdapter = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

class InfraElasticsearchSourceStatusAdapter {
  constructor(framework) {
    this.framework = framework;
  }

  async getIndexNames(requestContext, aliasName) {
    const indexMaps = await Promise.all([this.framework.callWithRequest(requestContext, 'indices.getAlias', {
      name: aliasName,
      filterPath: '*.settings.index.uuid' // to keep the response size as small as possible

    }).catch(withDefaultIfNotFound({})), this.framework.callWithRequest(requestContext, 'indices.get', {
      index: aliasName,
      filterPath: '*.settings.index.uuid' // to keep the response size as small as possible

    }).catch(withDefaultIfNotFound({}))]);
    return indexMaps.reduce((indexNames, indexMap) => [...indexNames, ...Object.keys(indexMap)], []);
  }

  async hasAlias(requestContext, aliasName) {
    return await this.framework.callWithRequest(requestContext, 'indices.existsAlias', {
      name: aliasName
    });
  }

  async getIndexStatus(requestContext, indexNames) {
    return await this.framework.callWithRequest(requestContext, 'search', {
      ignore_unavailable: true,
      allow_no_indices: true,
      index: indexNames,
      size: 0,
      terminate_after: 1,
      track_total_hits: 1
    }).then(response => {
      if (response._shards.total <= 0) {
        return 'missing';
      }

      if (response.hits.total.value > 0) {
        return 'available';
      }

      return 'empty';
    }, err => {
      if (err.status === 404) {
        return 'missing';
      }

      throw err;
    });
  }

}

exports.InfraElasticsearchSourceStatusAdapter = InfraElasticsearchSourceStatusAdapter;

const withDefaultIfNotFound = defaultValue => error => {
  if (error && error.status === 404) {
    return defaultValue;
  }

  throw error;
};