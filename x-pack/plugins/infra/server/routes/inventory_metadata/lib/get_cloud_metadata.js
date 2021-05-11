"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCloudMetadata = void 0;

var _inventory_models = require("../../../../common/inventory_models");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const getCloudMetadata = async (framework, req, sourceConfiguration, nodeType, currentTime) => {
  const model = (0, _inventory_models.findInventoryModel)(nodeType); // Only run this for AWS modules, eventually we might have more.

  if (model.requiredModule !== 'aws') {
    return {
      accounts: [],
      projects: [],
      regions: []
    };
  }

  const metricQuery = {
    allowNoIndices: true,
    ignoreUnavailable: true,
    index: sourceConfiguration.metricAlias,
    body: {
      query: {
        bool: {
          must: [{
            range: {
              [sourceConfiguration.fields.timestamp]: {
                gte: currentTime - 86400000,
                // 24 hours ago
                lte: currentTime,
                format: 'epoch_millis'
              }
            }
          }, {
            match: {
              'event.module': model.requiredModule
            }
          }]
        }
      },
      size: 0,
      aggs: {
        accounts: {
          terms: {
            field: 'cloud.account.id',
            size: 1000
          },
          aggs: {
            accountNames: {
              terms: {
                field: 'cloud.account.name',
                size: 1000
              }
            }
          }
        },
        regions: {
          terms: {
            field: 'cloud.region',
            size: 1000
          }
        }
      }
    }
  };
  const response = await framework.callWithRequest(req, 'search', metricQuery);
  const projectBuckets = response.aggregations && response.aggregations.projects ? response.aggregations.projects.buckets : [];
  const regionBuckets = response.aggregations && response.aggregations.regions ? response.aggregations.regions.buckets : [];
  const accounts = [];

  if (response.aggregations && response.aggregations.accounts) {
    response.aggregations.accounts.buckets.forEach(b => {
      if (b.accountNames.buckets.length) {
        accounts.push({
          value: b.key,
          // There should only be one account name for each account id.
          name: b.accountNames.buckets[0].key
        });
      }
    });
  }

  return {
    accounts,
    projects: projectBuckets.map(b => b.key),
    regions: regionBuckets.map(b => b.key)
  };
};

exports.getCloudMetadata = getCloudMetadata;