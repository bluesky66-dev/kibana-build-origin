"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.InfraFieldsDomain = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

class InfraFieldsDomain {
  constructor(adapter, libs) {
    this.adapter = adapter;
    this.libs = libs;
  }

  async getFields(requestContext, sourceId, indexType) {
    const {
      configuration
    } = await this.libs.sources.getSourceConfiguration(requestContext.core.savedObjects.client, sourceId);
    const includeMetricIndices = ['ANY', 'METRICS'].includes(indexType);
    const includeLogIndices = ['ANY', 'LOGS'].includes(indexType);
    const fields = await this.adapter.getIndexFields(requestContext, [...(includeMetricIndices ? [configuration.metricAlias] : []), ...(includeLogIndices ? [configuration.logAlias] : [])].join(','));
    return fields;
  }

}

exports.InfraFieldsDomain = InfraFieldsDomain;