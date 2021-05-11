"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.metadataQueryStrategyV1 = metadataQueryStrategyV1;
exports.metadataQueryStrategyV2 = metadataQueryStrategyV2;

var _constants = require("../../../../../common/endpoint/constants");

var _types = require("../../../../../common/endpoint/types");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function metadataQueryStrategyV1() {
  return {
    index: _constants.metadataIndexPattern,
    extraBodyProperties: {
      collapse: {
        field: 'agent.id',
        inner_hits: {
          name: 'most_recent',
          size: 1,
          sort: [{
            'event.created': 'desc'
          }]
        }
      },
      aggs: {
        total: {
          cardinality: {
            field: 'agent.id'
          }
        }
      }
    },
    queryResponseToHostListResult: searchResponse => {
      var _response$aggregation, _response$aggregation2;

      const response = searchResponse;
      return {
        resultLength: (response === null || response === void 0 ? void 0 : (_response$aggregation = response.aggregations) === null || _response$aggregation === void 0 ? void 0 : (_response$aggregation2 = _response$aggregation.total) === null || _response$aggregation2 === void 0 ? void 0 : _response$aggregation2.value) || 0,
        resultList: response.hits.hits.map(hit => hit.inner_hits.most_recent.hits.hits).flatMap(data => data).map(entry => entry._source),
        queryStrategyVersion: _types.MetadataQueryStrategyVersions.VERSION_1
      };
    },
    queryResponseToHostResult: searchResponse => {
      const response = searchResponse;
      return {
        resultLength: response.hits.hits.length,
        result: response.hits.hits.length > 0 ? response.hits.hits[0]._source : undefined,
        queryStrategyVersion: _types.MetadataQueryStrategyVersions.VERSION_1
      };
    }
  };
}

function metadataQueryStrategyV2() {
  return {
    index: _constants.metadataCurrentIndexPattern,
    extraBodyProperties: {
      track_total_hits: true
    },
    queryResponseToHostListResult: searchResponse => {
      var _response$hits;

      const response = searchResponse;
      const list = response.hits.hits.length > 0 ? response.hits.hits.map(entry => stripHostDetails(entry._source)) : [];
      return {
        resultLength: ((_response$hits = response.hits) === null || _response$hits === void 0 ? void 0 : _response$hits.total).value || 0,
        resultList: list,
        queryStrategyVersion: _types.MetadataQueryStrategyVersions.VERSION_2
      };
    },
    queryResponseToHostResult: searchResponse => {
      const response = searchResponse;
      return {
        resultLength: response.hits.hits.length,
        result: response.hits.hits.length > 0 ? stripHostDetails(response.hits.hits[0]._source) : undefined,
        queryStrategyVersion: _types.MetadataQueryStrategyVersions.VERSION_2
      };
    }
  };
} // remove the top-level 'HostDetails' property if found, from previous schemas


function stripHostDetails(host) {
  return 'HostDetails' in host ? host.HostDetails : host;
}