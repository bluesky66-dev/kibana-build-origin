"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.formatHostEdgesData = exports.ElasticsearchHostsAdapter = void 0;

var _fp = require("@elastic/safer-lodash-set/fp");

var _fp2 = require("lodash/fp");

var _build_query = require("../../utils/build_query");

var _ecs_fields = require("../ecs_fields");

var _queryDetail_host = require("./query.detail_host.dsl");

var _queryHosts = require("./query.hosts.dsl");

var _queryLast_first_seen_host = require("./query.last_first_seen_host.dsl");

var _constants = require("../../../common/constants");

var _handlers = require("../../endpoint/routes/metadata/handlers");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


class ElasticsearchHostsAdapter {
  constructor(framework, endpointContext) {
    this.framework = framework;
    this.endpointContext = endpointContext;
  }

  async getHosts(request, options) {
    const dsl = (0, _queryHosts.buildHostsQuery)(options);

    if (options.pagination && options.pagination.querySize >= _constants.DEFAULT_MAX_TABLE_QUERY_SIZE) {
      throw new Error(`No query size above ${_constants.DEFAULT_MAX_TABLE_QUERY_SIZE}`);
    }

    const response = await this.framework.callWithRequest(request, 'search', dsl);
    const {
      activePage,
      cursorStart,
      fakePossibleCount,
      querySize
    } = options.pagination;
    const totalCount = (0, _fp2.getOr)(0, 'aggregations.host_count.value', response);
    const buckets = (0, _fp2.getOr)([], 'aggregations.host_data.buckets', response);
    const hostsEdges = buckets.map(bucket => formatHostEdgesData(options.fields, bucket));
    const fakeTotalCount = fakePossibleCount <= totalCount ? fakePossibleCount : totalCount;
    const edges = hostsEdges.splice(cursorStart, querySize - cursorStart);
    const inspect = {
      dsl: [(0, _build_query.inspectStringifyObject)(dsl)],
      response: [(0, _build_query.inspectStringifyObject)(response)]
    };
    const showMorePagesIndicator = totalCount > fakeTotalCount;
    return {
      inspect,
      edges,
      totalCount,
      pageInfo: {
        activePage: activePage ? activePage : 0,
        fakeTotalCount,
        showMorePagesIndicator
      }
    };
  }

  async getHostOverview(request, options) {
    const dsl = (0, _queryDetail_host.buildHostOverviewQuery)(options);
    const response = await this.framework.callWithRequest(request, 'search', dsl);
    const aggregations = (0, _fp2.get)('aggregations', response) || {};
    const inspect = {
      dsl: [(0, _build_query.inspectStringifyObject)(dsl)],
      response: [(0, _build_query.inspectStringifyObject)(response)]
    };
    const formattedHostItem = formatHostItem(options.fields, aggregations);
    const ident = // endpoint-generated ID, NOT elastic-agent-id
    formattedHostItem.agent && formattedHostItem.agent.id ? Array.isArray(formattedHostItem.agent.id) ? formattedHostItem.agent.id[0] : formattedHostItem.agent.id : null;
    const endpoint = await this.getHostEndpoint(request, ident);
    return {
      inspect,
      _id: options.hostName,
      ...formattedHostItem,
      endpoint
    };
  }

  async getHostEndpoint(request, id) {
    const logger = this.endpointContext.logFactory.get('metadata');

    try {
      const agentService = this.endpointContext.service.getAgentService();

      if (agentService === undefined) {
        throw new Error('agentService not available');
      }

      const metadataRequestContext = {
        endpointAppContextService: this.endpointContext.service,
        logger,
        requestHandlerContext: request.context
      };
      const endpointData = id != null && metadataRequestContext.endpointAppContextService.getAgentService() != null ? await (0, _handlers.getHostData)(metadataRequestContext, id) : null;
      return endpointData != null && endpointData.metadata ? {
        endpointPolicy: endpointData.metadata.Endpoint.policy.applied.name,
        policyStatus: endpointData.metadata.Endpoint.policy.applied.status,
        sensorVersion: endpointData.metadata.agent.version
      } : null;
    } catch (err) {
      logger.warn(JSON.stringify(err, null, 2));
      return null;
    }
  }

  async getHostFirstLastSeen(request, options) {
    const dsl = (0, _queryLast_first_seen_host.buildLastFirstSeenHostQuery)(options);
    const response = await this.framework.callWithRequest(request, 'search', dsl);
    const aggregations = (0, _fp2.get)('aggregations', response) || {};
    const inspect = {
      dsl: [(0, _build_query.inspectStringifyObject)(dsl)],
      response: [(0, _build_query.inspectStringifyObject)(response)]
    };
    return {
      inspect,
      firstSeen: (0, _fp2.get)('firstSeen.value_as_string', aggregations),
      lastSeen: (0, _fp2.get)('lastSeen.value_as_string', aggregations)
    };
  }

}

exports.ElasticsearchHostsAdapter = ElasticsearchHostsAdapter;

const formatHostEdgesData = (fields, bucket) => fields.reduce((flattenedFields, fieldName) => {
  const hostId = (0, _fp2.get)('key', bucket);
  flattenedFields.node._id = hostId || null;
  flattenedFields.cursor.value = hostId || '';
  const fieldValue = getHostFieldValue(fieldName, bucket);

  if (fieldValue != null) {
    return (0, _fp.set)(`node.${fieldName}`, fieldValue, flattenedFields);
  }

  return flattenedFields;
}, {
  node: {},
  cursor: {
    value: '',
    tiebreaker: null
  }
});

exports.formatHostEdgesData = formatHostEdgesData;

const formatHostItem = (fields, bucket) => fields.reduce((flattenedFields, fieldName) => {
  const fieldValue = getHostFieldValue(fieldName, bucket);

  if (fieldValue != null) {
    return (0, _fp.set)(fieldName, fieldValue, flattenedFields);
  }

  return flattenedFields;
}, {});

const getHostFieldValue = (fieldName, bucket) => {
  const aggField = _ecs_fields.hostFieldsMap[fieldName] ? _ecs_fields.hostFieldsMap[fieldName].replace(/\./g, '_') : fieldName.replace(/\./g, '_');

  if (['host.ip', 'host.mac', 'cloud.instance.id', 'cloud.machine.type', 'cloud.provider', 'cloud.region'].includes(fieldName) && (0, _fp2.has)(aggField, bucket)) {
    const data = (0, _fp2.get)(aggField, bucket);
    return data.buckets.map(obj => obj.key);
  } else if ((0, _fp2.has)(`${aggField}.buckets`, bucket)) {
    return getFirstItem((0, _fp2.get)(`${aggField}`, bucket));
  } else if ((0, _fp2.has)(aggField, bucket)) {
    const valueObj = (0, _fp2.get)(aggField, bucket);
    return valueObj.value_as_string;
  } else if (['host.name', 'host.os.name', 'host.os.version'].includes(fieldName)) {
    switch (fieldName) {
      case 'host.name':
        return (0, _fp2.get)('key', bucket) || null;

      case 'host.os.name':
        return (0, _fp2.get)('os.hits.hits[0]._source.host.os.name', bucket) || null;

      case 'host.os.version':
        return (0, _fp2.get)('os.hits.hits[0]._source.host.os.version', bucket) || null;
    }
  }

  return null;
};

const getFirstItem = data => {
  const firstItem = (0, _fp2.head)(data.buckets);

  if (firstItem == null) {
    return null;
  }

  return firstItem.key;
};