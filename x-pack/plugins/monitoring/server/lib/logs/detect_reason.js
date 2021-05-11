"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.detectReason = detectReason;

var _create_query = require("../create_query");

var _lodash = require("lodash");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function doesFilebeatIndexExist(req, filebeatIndexPattern, {
  start,
  end,
  clusterUuid,
  nodeUuid,
  indexUuid
}) {
  const metric = {
    timestampField: '@timestamp'
  };
  const filter = [(0, _create_query.createTimeFilter)({
    start,
    end,
    metric
  })];
  const typeFilter = {
    term: {
      'service.type': 'elasticsearch'
    }
  };
  const structuredLogsFilter = {
    exists: {
      field: 'elasticsearch.cluster'
    }
  };
  const clusterFilter = {
    term: {
      'elasticsearch.cluster.uuid': clusterUuid
    }
  };
  const nodeFilter = {
    term: {
      'elasticsearch.node.id': nodeUuid
    }
  };
  const indexFilter = {
    term: {
      'elasticsearch.index.name': indexUuid
    }
  };
  const indexPatternExistsQuery = {
    query: {
      bool: {
        filter
      }
    }
  };
  const typeExistsAtAnyTimeQuery = {
    query: {
      bool: {
        filter: [typeFilter]
      }
    }
  };
  const typeExistsQuery = {
    query: {
      bool: {
        filter: [...filter, typeFilter]
      }
    }
  };
  const usingStructuredLogsQuery = {
    query: {
      bool: {
        filter: [...filter, typeFilter, structuredLogsFilter]
      }
    }
  };
  const clusterExistsQuery = {
    query: {
      bool: {
        filter: [...filter, typeFilter, clusterFilter]
      }
    }
  };
  const nodeExistsQuery = {
    query: {
      bool: {
        filter: [...filter, typeFilter, clusterFilter, nodeFilter]
      }
    }
  };
  const indexExistsQuery = {
    query: {
      bool: {
        filter: [...filter, typeFilter, clusterFilter, indexFilter]
      }
    }
  };
  const defaultParams = {
    size: 0
  };
  const body = [{
    index: filebeatIndexPattern
  }, { ...defaultParams
  }, {
    index: filebeatIndexPattern
  }, { ...defaultParams,
    ...indexPatternExistsQuery
  }, {
    index: filebeatIndexPattern
  }, { ...defaultParams,
    ...typeExistsAtAnyTimeQuery
  }, {
    index: filebeatIndexPattern
  }, { ...defaultParams,
    ...typeExistsQuery
  }, {
    index: filebeatIndexPattern
  }, { ...defaultParams,
    ...usingStructuredLogsQuery
  }];

  if (clusterUuid) {
    body.push(...[{
      index: filebeatIndexPattern
    }, { ...defaultParams,
      ...clusterExistsQuery
    }]);
  }

  if (nodeUuid) {
    body.push(...[{
      index: filebeatIndexPattern
    }, { ...defaultParams,
      ...nodeExistsQuery
    }]);
  }

  if (indexUuid) {
    body.push(...[{
      index: filebeatIndexPattern
    }, { ...defaultParams,
      ...indexExistsQuery
    }]);
  }

  const {
    callWithRequest
  } = req.server.plugins.elasticsearch.getCluster('monitoring');
  const {
    responses: [indexPatternExistsResponse, indexPatternExistsInTimeRangeResponse, typeExistsAtAnyTimeResponse, typeExistsResponse, usingStructuredLogsResponse, clusterExistsResponse, nodeExistsResponse, indexExistsResponse]
  } = await callWithRequest(req, 'msearch', {
    body
  });
  return {
    indexPatternExists: (0, _lodash.get)(indexPatternExistsResponse, 'hits.total.value', 0) > 0,
    indexPatternInTimeRangeExists: (0, _lodash.get)(indexPatternExistsInTimeRangeResponse, 'hits.total.value', 0) > 0,
    typeExistsAtAnyTime: (0, _lodash.get)(typeExistsAtAnyTimeResponse, 'hits.total.value', 0) > 0,
    typeExists: (0, _lodash.get)(typeExistsResponse, 'hits.total.value', 0) > 0,
    usingStructuredLogs: (0, _lodash.get)(usingStructuredLogsResponse, 'hits.total.value', 0) > 0,
    clusterExists: clusterUuid ? (0, _lodash.get)(clusterExistsResponse, 'hits.total.value', 0) > 0 : null,
    nodeExists: nodeUuid ? (0, _lodash.get)(nodeExistsResponse, 'hits.total.value', 0) > 0 : null,
    indexExists: indexUuid ? (0, _lodash.get)(indexExistsResponse, 'hits.total.value', 0) > 0 : null
  };
}

async function detectReason(req, filebeatIndexPattern, opts) {
  return await doesFilebeatIndexExist(req, filebeatIndexPattern, opts);
}