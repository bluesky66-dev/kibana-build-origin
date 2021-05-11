"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildFieldsTermAggregation = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const buildFieldsTermAggregation = esFields => esFields.reduce((res, field) => ({ ...res,
  ...getTermsAggregationTypeFromField(field)
}), {});

exports.buildFieldsTermAggregation = buildFieldsTermAggregation;

const getTermsAggregationTypeFromField = field => {
  if (field === 'host.ip') {
    return {
      host_ip: {
        terms: {
          script: {
            source: "doc['host.ip']",
            lang: 'painless'
          },
          size: 10,
          order: {
            timestamp: 'desc'
          }
        },
        aggs: {
          timestamp: {
            max: {
              field: '@timestamp'
            }
          }
        }
      }
    };
  }

  return {
    [field.replace(/\./g, '_')]: {
      terms: {
        field,
        size: 10,
        order: {
          timestamp: 'desc'
        }
      },
      aggs: {
        timestamp: {
          max: {
            field: '@timestamp'
          }
        }
      }
    }
  };
};