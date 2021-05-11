"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSignalVersionsByIndex = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Retrieves a breakdown of signals version for each
 * given signals index.
 *
 * @param esClient An {@link ElasticsearchClient}
 * @param index name(s) of the signals index(es)
 *
 * @returns a {@link SignalsVersionsByIndex} object
 *
 * @throws if client returns an error
 */

const getSignalVersionsByIndex = async ({
  esClient,
  index
}) => {
  const {
    body
  } = await esClient.search({
    index,
    size: 0,
    body: {
      aggs: {
        signals_indices: {
          terms: {
            field: '_index'
          },
          aggs: {
            signal_versions: {
              terms: {
                field: 'signal._meta.version',
                missing: 0
              }
            }
          }
        }
      }
    }
  });
  const indexBuckets = body.aggregations.signals_indices.buckets;
  return index.reduce((agg, _index) => {
    var _bucket$signal_versio, _bucket$signal_versio2;

    const bucket = indexBuckets.find(ib => ib.key === _index);
    const signalVersionBuckets = (_bucket$signal_versio = bucket === null || bucket === void 0 ? void 0 : (_bucket$signal_versio2 = bucket.signal_versions) === null || _bucket$signal_versio2 === void 0 ? void 0 : _bucket$signal_versio2.buckets) !== null && _bucket$signal_versio !== void 0 ? _bucket$signal_versio : [];
    const signalsVersions = signalVersionBuckets.map(sb => ({
      version: sb.key,
      count: sb.doc_count
    }));
    return { ...agg,
      [_index]: signalsVersions
    };
  }, {});
};

exports.getSignalVersionsByIndex = getSignalVersionsByIndex;