"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getLogs = getLogs;

var _moment = _interopRequireDefault(require("moment"));

var _lodash = require("lodash");

var _error_missing_required = require("../error_missing_required");

var _create_query = require("../create_query");

var _detect_reason = require("./detect_reason");

var _format_timezone = require("../format_timezone");

var _get_timezone = require("../get_timezone");

var _detect_reason_from_exception = require("./detect_reason_from_exception");

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


async function handleResponse(response, req, filebeatIndexPattern, opts) {
  const result = {
    enabled: false,
    logs: []
  };
  const timezone = await (0, _get_timezone.getTimezone)(req);
  const hits = (0, _lodash.get)(response, 'hits.hits', []);

  if (hits.length) {
    result.enabled = true;
    result.logs = hits.map(hit => {
      const source = hit._source;
      const type = (0, _lodash.get)(source, 'event.dataset').split('.')[1];
      const utcTimestamp = (0, _moment.default)((0, _lodash.get)(source, '@timestamp')).valueOf();
      return {
        timestamp: (0, _format_timezone.formatUTCTimestampForTimezone)(utcTimestamp, timezone),
        component: (0, _lodash.get)(source, 'elasticsearch.component'),
        node: (0, _lodash.get)(source, 'elasticsearch.node.name'),
        index: (0, _lodash.get)(source, 'elasticsearch.index.name'),
        level: (0, _lodash.get)(source, 'log.level'),
        type,
        message: (0, _lodash.get)(source, 'message')
      };
    });
  } else {
    result.reason = await (0, _detect_reason.detectReason)(req, filebeatIndexPattern, opts);
  }

  return result;
}

async function getLogs(config, req, filebeatIndexPattern, {
  clusterUuid,
  nodeUuid,
  indexUuid,
  start,
  end
}) {
  (0, _error_missing_required.checkParam)(filebeatIndexPattern, 'filebeatIndexPattern in logs/getLogs');
  const metric = {
    timestampField: '@timestamp'
  };
  const filter = [{
    term: {
      'service.type': 'elasticsearch'
    }
  }, (0, _create_query.createTimeFilter)({
    start,
    end,
    metric
  })];

  if (clusterUuid) {
    filter.push({
      term: {
        'elasticsearch.cluster.uuid': clusterUuid
      }
    });
  }

  if (nodeUuid) {
    filter.push({
      term: {
        'elasticsearch.node.id': nodeUuid
      }
    });
  }

  if (indexUuid) {
    filter.push({
      term: {
        'elasticsearch.index.name': indexUuid
      }
    });
  }

  const params = {
    index: filebeatIndexPattern,
    size: Math.min(50, config.get('monitoring.ui.elasticsearch.logFetchCount')),
    filterPath: ['hits.hits._source.message', 'hits.hits._source.log.level', 'hits.hits._source.@timestamp', 'hits.hits._source.event.dataset', 'hits.hits._source.elasticsearch.component', 'hits.hits._source.elasticsearch.index.name', 'hits.hits._source.elasticsearch.node.name'],
    ignoreUnavailable: true,
    body: {
      sort: {
        '@timestamp': {
          order: 'desc',
          unmapped_type: 'long'
        }
      },
      query: {
        bool: {
          filter
        }
      }
    }
  };
  const {
    callWithRequest
  } = req.server.plugins.elasticsearch.getCluster('monitoring');
  let result = {};

  try {
    const response = await callWithRequest(req, 'search', params);
    result = await handleResponse(response, req, filebeatIndexPattern, {
      clusterUuid,
      nodeUuid,
      indexUuid,
      start,
      end
    });
  } catch (err) {
    result.reason = (0, _detect_reason_from_exception.detectReasonFromException)(err);
  }

  return { ...result,
    limit: params.size
  };
}