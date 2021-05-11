"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getStackProductsUsage = void 0;

var _fetch_es_usage = require("./fetch_es_usage");

var _constants = require("../../../../common/constants");

var _fetch_stack_product_usage = require("./fetch_stack_product_usage");

var _get_ccs_index_pattern = require("../../../lib/alerts/get_ccs_index_pattern");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const getStackProductsUsage = async (config, callCluster, availableCcs, clusterUuid) => {
  const elasticsearchIndex = (0, _get_ccs_index_pattern.getCcsIndexPattern)(_constants.INDEX_PATTERN_ELASTICSEARCH, availableCcs);
  const kibanaIndex = (0, _get_ccs_index_pattern.getCcsIndexPattern)(_constants.INDEX_PATTERN_KIBANA, availableCcs);
  const logstashIndex = (0, _get_ccs_index_pattern.getCcsIndexPattern)(_constants.INDEX_PATTERN_LOGSTASH, availableCcs);
  const beatsIndex = (0, _get_ccs_index_pattern.getCcsIndexPattern)(_constants.INDEX_PATTERN_BEATS, availableCcs);
  const [elasticsearch, kibana, logstash, beats, apm] = await Promise.all([(0, _fetch_es_usage.fetchESUsage)(config, callCluster, clusterUuid, elasticsearchIndex), (0, _fetch_stack_product_usage.fetchStackProductUsage)(config, callCluster, clusterUuid, kibanaIndex, 'kibana_stats', 'kibana_stats.kibana.uuid'), (0, _fetch_stack_product_usage.fetchStackProductUsage)(config, callCluster, clusterUuid, logstashIndex, 'logstash_stats', 'logstash_stats.logstash.uuid'), (0, _fetch_stack_product_usage.fetchStackProductUsage)(config, callCluster, clusterUuid, beatsIndex, 'beats_stats', 'beats_stats.beat.uuid'), (0, _fetch_stack_product_usage.fetchStackProductUsage)(config, callCluster, clusterUuid, beatsIndex, 'beats_stats', 'beats_stats.beat.uuid', [{
    term: {
      'beats_stats.beat.type': 'apm-server'
    }
  }])]);
  return {
    elasticsearch,
    kibana,
    logstash,
    beats,
    apm
  };
};

exports.getStackProductsUsage = getStackProductsUsage;