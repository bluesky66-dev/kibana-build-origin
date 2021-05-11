"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createTimeFilter = createTimeFilter;
exports.createQuery = createQuery;

var _lodash = require("lodash");

var _error_missing_required = require("./error_missing_required");

var _moment = _interopRequireDefault(require("moment"));

var _standalone_clusters = require("./standalone_clusters");

var _constants = require("../../common/constants");

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function createTimeFilter(options) {
  const {
    start,
    end
  } = options;

  if (!start && !end) {
    return null;
  }

  const timestampField = (0, _lodash.get)(options, 'metric.timestampField');

  if (!timestampField) {
    throw new _error_missing_required.MissingRequiredError('metric.timestampField');
  }

  const timeRangeFilter = {
    range: {
      [timestampField]: {
        format: 'epoch_millis'
      }
    }
  };

  if (start) {
    timeRangeFilter.range[timestampField].gte = _moment.default.utc(start).valueOf();
  }

  if (end) {
    timeRangeFilter.range[timestampField].lte = _moment.default.utc(end).valueOf();
  }

  return timeRangeFilter;
}
/*
 * Creates the boilerplace for querying monitoring data, including filling in
 * document UUIDs, start time and end time, and injecting additional filters.
 *
 * Options object:
 * @param {String} options.type - `type` field value of the documents
 * @param {Array} options.filters - additional filters to add to the `bool` section of the query. Default: []
 * @param {string} options.clusterUuid - a UUID of the cluster. Required.
 * @param {string} options.uuid - a UUID of the metric to filter for, or `null` if UUID should not be part of the query
 * @param {Date} options.start - numeric timestamp (optional)
 * @param {Date} options.end - numeric timestamp (optional)
 * @param {Metric} options.metric - Metric instance or metric fields object @see ElasticsearchMetric.getMetricFields
 */


function createQuery(options) {
  options = (0, _lodash.defaults)(options, {
    filters: []
  });
  const {
    type,
    clusterUuid,
    uuid,
    filters
  } = options;
  const isFromStandaloneCluster = clusterUuid === _constants.STANDALONE_CLUSTER_CLUSTER_UUID;
  let typeFilter;

  if (type) {
    typeFilter = {
      bool: {
        should: [{
          term: {
            type
          }
        }, {
          term: {
            'metricset.name': type
          }
        }]
      }
    };
  }

  let clusterUuidFilter;

  if (clusterUuid && !isFromStandaloneCluster) {
    clusterUuidFilter = {
      term: {
        cluster_uuid: clusterUuid
      }
    };
  }

  let uuidFilter; // options.uuid can be null, for example getting all the clusters

  if (uuid) {
    const uuidField = (0, _lodash.get)(options, 'metric.uuidField');

    if (!uuidField) {
      throw new _error_missing_required.MissingRequiredError('options.uuid given but options.metric.uuidField is false');
    }

    uuidFilter = {
      term: {
        [uuidField]: uuid
      }
    };
  }

  const timestampField = (0, _lodash.get)(options, 'metric.timestampField');

  if (!timestampField) {
    throw new _error_missing_required.MissingRequiredError('metric.timestampField');
  }

  const timeRangeFilter = createTimeFilter(options);
  const combinedFilters = [typeFilter, clusterUuidFilter, uuidFilter, ...filters];

  if (timeRangeFilter) {
    combinedFilters.push(timeRangeFilter);
  }

  if (isFromStandaloneCluster) {
    combinedFilters.push(_standalone_clusters.standaloneClusterFilter);
  }

  const query = {
    bool: {
      filter: combinedFilters.filter(Boolean)
    }
  };
  return query;
}