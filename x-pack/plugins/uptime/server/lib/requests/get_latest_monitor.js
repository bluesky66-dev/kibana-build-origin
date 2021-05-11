"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getLatestMonitor = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// Get The monitor latest state sorted by timestamp with date range

const getLatestMonitor = async ({
  uptimeEsClient,
  dateStart,
  dateEnd,
  monitorId,
  observerLocation
}) => {
  var _result$hits, _result$hits$hits, _doc$_id, _ref;

  const params = {
    query: {
      bool: {
        filter: [{
          exists: {
            field: 'summary'
          }
        }, {
          range: {
            '@timestamp': {
              gte: dateStart,
              lte: dateEnd
            }
          }
        }, ...(monitorId ? [{
          term: {
            'monitor.id': monitorId
          }
        }] : []), ...(observerLocation ? [{
          term: {
            'observer.geo.name': observerLocation
          }
        }] : [])]
      }
    },
    size: 1,
    _source: ['url', 'monitor', 'observer', '@timestamp', 'tls.*', 'http', 'error', 'tags'],
    sort: {
      '@timestamp': {
        order: 'desc'
      }
    }
  };
  const {
    body: result
  } = await uptimeEsClient.search({
    body: params
  });
  const doc = (_result$hits = result.hits) === null || _result$hits === void 0 ? void 0 : (_result$hits$hits = _result$hits.hits) === null || _result$hits$hits === void 0 ? void 0 : _result$hits$hits[0];
  const docId = (_doc$_id = doc === null || doc === void 0 ? void 0 : doc._id) !== null && _doc$_id !== void 0 ? _doc$_id : '';
  const {
    tls,
    ...ping
  } = (_ref = doc === null || doc === void 0 ? void 0 : doc._source) !== null && _ref !== void 0 ? _ref : {};
  return { ...ping,
    docId,
    timestamp: ping['@timestamp'],
    tls
  };
};

exports.getLatestMonitor = getLatestMonitor;