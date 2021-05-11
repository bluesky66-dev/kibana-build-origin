"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildThresholdCardinalityQuery = exports.buildThresholdTermsQuery = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const buildThresholdTermsQuery = ({
  query,
  fields,
  stackByField,
  missing
}) => {
  if (fields.length > 1) {
    return {
      eventActionGroup: { ...query.eventActionGroup,
        terms: { ...query.eventActionGroup.terms,
          script: {
            lang: 'painless',
            source: fields.map(f => `doc['${f}'].value`).join(` + ':' + `)
          }
        }
      }
    };
  } else {
    var _fields$;

    return {
      eventActionGroup: { ...query.eventActionGroup,
        terms: { ...query.eventActionGroup.terms,
          field: (_fields$ = fields[0]) !== null && _fields$ !== void 0 ? _fields$ : stackByField,
          ...missing
        }
      }
    };
  }
};

exports.buildThresholdTermsQuery = buildThresholdTermsQuery;

const buildThresholdCardinalityQuery = ({
  query,
  cardinalityField,
  cardinalityValue
}) => {
  if (cardinalityField != null && cardinalityField !== '' && cardinalityValue !== '') {
    return {
      eventActionGroup: { ...query.eventActionGroup,
        aggs: { ...query.eventActionGroup.aggs,
          cardinality_count: {
            cardinality: {
              field: cardinalityField
            }
          },
          cardinality_check: {
            bucket_selector: {
              buckets_path: {
                cardinalityCount: 'cardinality_count'
              },
              script: `params.cardinalityCount >= ${cardinalityValue}`
            }
          }
        }
      }
    };
  } else {
    return query;
  }
};

exports.buildThresholdCardinalityQuery = buildThresholdCardinalityQuery;