"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getHostData = getHostData;
exports.mapToHostResultList = mapToHostResultList;
exports.enrichHostMetadata = enrichHostMetadata;
exports.getMetadataRequestHandler = exports.getMetadataListRequestHandler = exports.getLogger = void 0;

var _boom = _interopRequireDefault(require("@hapi/boom"));

var _types = require("../../../../common/endpoint/types");

var _query_builders = require("./query_builders");

var _unenroll = require("./support/unenroll");

var _agent_status = require("./support/agent_status");

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


const HOST_STATUS_MAPPING = new Map([['online', _types.HostStatus.ONLINE], ['offline', _types.HostStatus.OFFLINE], ['unenrolling', _types.HostStatus.UNENROLLING]]);
/**
 * 00000000-0000-0000-0000-000000000000 is initial Elastic Agent id sent by Endpoint before policy is configured
 * 11111111-1111-1111-1111-111111111111 is Elastic Agent id sent by Endpoint when policy does not contain an id
 */

const IGNORED_ELASTIC_AGENT_IDS = ['00000000-0000-0000-0000-000000000000', '11111111-1111-1111-1111-111111111111'];

const getLogger = endpointAppContext => {
  return endpointAppContext.logFactory.get('metadata');
};

exports.getLogger = getLogger;

const getMetadataListRequestHandler = function (endpointAppContext, logger, queryStrategyVersion) {
  return async (context, request, response) => {
    try {
      var _request$body, _request$body$filters, _request$body$filters2, _request$body2, _request$body2$filter, _endpointAppContext$s, _endpointAppContext$s2;

      const agentService = endpointAppContext.service.getAgentService();

      if (agentService === undefined) {
        throw new Error('agentService not available');
      }

      const metadataRequestContext = {
        endpointAppContextService: endpointAppContext.service,
        logger,
        requestHandlerContext: context
      };
      const unenrolledAgentIds = await (0, _unenroll.findAllUnenrolledAgentIds)(agentService, context.core.savedObjects.client, context.core.elasticsearch.client.asCurrentUser);
      const statusIDs = request !== null && request !== void 0 && (_request$body = request.body) !== null && _request$body !== void 0 && (_request$body$filters = _request$body.filters) !== null && _request$body$filters !== void 0 && (_request$body$filters2 = _request$body$filters.host_status) !== null && _request$body$filters2 !== void 0 && _request$body$filters2.length ? await (0, _agent_status.findAgentIDsByStatus)(agentService, context.core.savedObjects.client, context.core.elasticsearch.client.asCurrentUser, (_request$body2 = request.body) === null || _request$body2 === void 0 ? void 0 : (_request$body2$filter = _request$body2.filters) === null || _request$body2$filter === void 0 ? void 0 : _request$body2$filter.host_status) : undefined;
      const queryStrategy = await ((_endpointAppContext$s = endpointAppContext.service) === null || _endpointAppContext$s === void 0 ? void 0 : (_endpointAppContext$s2 = _endpointAppContext$s.getMetadataService()) === null || _endpointAppContext$s2 === void 0 ? void 0 : _endpointAppContext$s2.queryStrategy(context.core.savedObjects.client, queryStrategyVersion));
      const queryParams = await (0, _query_builders.kibanaRequestToMetadataListESQuery)(request, endpointAppContext, queryStrategy, {
        unenrolledAgentIds: unenrolledAgentIds.concat(IGNORED_ELASTIC_AGENT_IDS),
        statusAgentIDs: statusIDs
      });
      const hostListQueryResult = queryStrategy.queryResponseToHostListResult(await context.core.elasticsearch.legacy.client.callAsCurrentUser('search', queryParams));
      return response.ok({
        body: await mapToHostResultList(queryParams, hostListQueryResult, metadataRequestContext)
      });
    } catch (err) {
      logger.warn(JSON.stringify(err, null, 2));
      return response.internalError({
        body: err
      });
    }
  };
};

exports.getMetadataListRequestHandler = getMetadataListRequestHandler;

const getMetadataRequestHandler = function (endpointAppContext, logger, queryStrategyVersion) {
  return async (context, request, response) => {
    const agentService = endpointAppContext.service.getAgentService();

    if (agentService === undefined) {
      return response.internalError({
        body: 'agentService not available'
      });
    }

    const metadataRequestContext = {
      endpointAppContextService: endpointAppContext.service,
      logger,
      requestHandlerContext: context
    };

    try {
      var _request$params;

      const doc = await getHostData(metadataRequestContext, request === null || request === void 0 ? void 0 : (_request$params = request.params) === null || _request$params === void 0 ? void 0 : _request$params.id, queryStrategyVersion);

      if (doc) {
        return response.ok({
          body: doc
        });
      }

      return response.notFound({
        body: 'Endpoint Not Found'
      });
    } catch (err) {
      logger.warn(JSON.stringify(err, null, 2));

      if (err.isBoom) {
        return response.customError({
          statusCode: err.output.statusCode,
          body: {
            message: err.message
          }
        });
      }

      return response.internalError({
        body: err
      });
    }
  };
};

exports.getMetadataRequestHandler = getMetadataRequestHandler;

async function getHostData(metadataRequestContext, id, queryStrategyVersion) {
  var _metadataRequestConte, _metadataRequestConte2;

  const queryStrategy = await ((_metadataRequestConte = metadataRequestContext.endpointAppContextService) === null || _metadataRequestConte === void 0 ? void 0 : (_metadataRequestConte2 = _metadataRequestConte.getMetadataService()) === null || _metadataRequestConte2 === void 0 ? void 0 : _metadataRequestConte2.queryStrategy(metadataRequestContext.requestHandlerContext.core.savedObjects.client, queryStrategyVersion));
  const query = (0, _query_builders.getESQueryHostMetadataByID)(id, queryStrategy);
  const hostResult = queryStrategy.queryResponseToHostResult(await metadataRequestContext.requestHandlerContext.core.elasticsearch.legacy.client.callAsCurrentUser('search', query));
  const hostMetadata = hostResult.result;

  if (!hostMetadata) {
    return undefined;
  }

  const agent = await findAgent(metadataRequestContext, hostMetadata);

  if (agent && !agent.active) {
    throw _boom.default.badRequest('the requested endpoint is unenrolled');
  }

  const metadata = await enrichHostMetadata(hostMetadata, metadataRequestContext, hostResult.queryStrategyVersion);
  return { ...metadata,
    query_strategy_version: hostResult.queryStrategyVersion
  };
}

async function findAgent(metadataRequestContext, hostMetadata) {
  try {
    var _metadataRequestConte3, _metadataRequestConte4;

    return await ((_metadataRequestConte3 = metadataRequestContext.endpointAppContextService) === null || _metadataRequestConte3 === void 0 ? void 0 : (_metadataRequestConte4 = _metadataRequestConte3.getAgentService()) === null || _metadataRequestConte4 === void 0 ? void 0 : _metadataRequestConte4.getAgent(metadataRequestContext.requestHandlerContext.core.savedObjects.client, metadataRequestContext.requestHandlerContext.core.elasticsearch.client.asCurrentUser, hostMetadata.elastic.agent.id));
  } catch (e) {
    if (metadataRequestContext.requestHandlerContext.core.savedObjects.client.errors.isNotFoundError(e)) {
      metadataRequestContext.logger.warn(`agent with id ${hostMetadata.elastic.agent.id} not found`);
      return undefined;
    } else {
      throw e;
    }
  }
}

async function mapToHostResultList( // eslint-disable-next-line @typescript-eslint/no-explicit-any
queryParams, hostListQueryResult, metadataRequestContext) {
  const totalNumberOfHosts = hostListQueryResult.resultLength;

  if (hostListQueryResult.resultList.length > 0) {
    return {
      request_page_size: queryParams.size,
      request_page_index: queryParams.from,
      hosts: await Promise.all(hostListQueryResult.resultList.map(async entry => enrichHostMetadata(entry, metadataRequestContext, hostListQueryResult.queryStrategyVersion))),
      total: totalNumberOfHosts,
      query_strategy_version: hostListQueryResult.queryStrategyVersion
    };
  } else {
    return {
      request_page_size: queryParams.size,
      request_page_index: queryParams.from,
      total: totalNumberOfHosts,
      hosts: [],
      query_strategy_version: hostListQueryResult.queryStrategyVersion
    };
  }
}

async function enrichHostMetadata(hostMetadata, metadataRequestContext, metadataQueryStrategyVersion) {
  var _hostMetadata$elastic, _hostMetadata$elastic2;

  let hostStatus = _types.HostStatus.ERROR;
  let elasticAgentId = hostMetadata === null || hostMetadata === void 0 ? void 0 : (_hostMetadata$elastic = hostMetadata.elastic) === null || _hostMetadata$elastic === void 0 ? void 0 : (_hostMetadata$elastic2 = _hostMetadata$elastic.agent) === null || _hostMetadata$elastic2 === void 0 ? void 0 : _hostMetadata$elastic2.id;
  const log = metadataRequestContext.logger;

  try {
    var _metadataRequestConte5, _metadataRequestConte6;
    /**
     * Get agent status by elastic agent id if available or use the endpoint-agent id.
     */


    if (!elasticAgentId) {
      elasticAgentId = hostMetadata.agent.id;
      log.warn(`Missing elastic agent id, using host id instead ${elasticAgentId}`);
    }

    const status = await ((_metadataRequestConte5 = metadataRequestContext.endpointAppContextService) === null || _metadataRequestConte5 === void 0 ? void 0 : (_metadataRequestConte6 = _metadataRequestConte5.getAgentService()) === null || _metadataRequestConte6 === void 0 ? void 0 : _metadataRequestConte6.getAgentStatusById(metadataRequestContext.requestHandlerContext.core.savedObjects.client, metadataRequestContext.requestHandlerContext.core.elasticsearch.client.asCurrentUser, elasticAgentId));
    hostStatus = HOST_STATUS_MAPPING.get(status) || _types.HostStatus.ERROR;
  } catch (e) {
    if (metadataRequestContext.requestHandlerContext.core.savedObjects.client.errors.isNotFoundError(e)) {
      log.warn(`agent with id ${elasticAgentId} not found`);
    } else {
      log.error(e);
      throw e;
    }
  }

  let policyInfo;

  try {
    var _metadataRequestConte7, _metadataRequestConte8, _metadataRequestConte9;

    const agent = await ((_metadataRequestConte7 = metadataRequestContext.endpointAppContextService) === null || _metadataRequestConte7 === void 0 ? void 0 : (_metadataRequestConte8 = _metadataRequestConte7.getAgentService()) === null || _metadataRequestConte8 === void 0 ? void 0 : _metadataRequestConte8.getAgent(metadataRequestContext.requestHandlerContext.core.savedObjects.client, metadataRequestContext.requestHandlerContext.core.elasticsearch.client.asCurrentUser, elasticAgentId));
    const agentPolicy = await ((_metadataRequestConte9 = metadataRequestContext.endpointAppContextService.getAgentPolicyService()) === null || _metadataRequestConte9 === void 0 ? void 0 : _metadataRequestConte9.get(metadataRequestContext.requestHandlerContext.core.savedObjects.client, agent === null || agent === void 0 ? void 0 : agent.policy_id, true));
    const endpointPolicy = ((agentPolicy === null || agentPolicy === void 0 ? void 0 : agentPolicy.package_policies) || []).find(policy => {
      var _policy$package;

      return ((_policy$package = policy.package) === null || _policy$package === void 0 ? void 0 : _policy$package.name) === 'endpoint';
    });
    policyInfo = {
      agent: {
        applied: {
          revision: (agent === null || agent === void 0 ? void 0 : agent.policy_revision) || 0,
          id: (agent === null || agent === void 0 ? void 0 : agent.policy_id) || ''
        },
        configured: {
          revision: (agentPolicy === null || agentPolicy === void 0 ? void 0 : agentPolicy.revision) || 0,
          id: (agentPolicy === null || agentPolicy === void 0 ? void 0 : agentPolicy.id) || ''
        }
      },
      endpoint: {
        revision: (endpointPolicy === null || endpointPolicy === void 0 ? void 0 : endpointPolicy.revision) || 0,
        id: (endpointPolicy === null || endpointPolicy === void 0 ? void 0 : endpointPolicy.id) || ''
      }
    };
  } catch (e) {
    // this is a non-vital enrichment of expected policy revisions.
    // if we fail just fetching these, the rest of the endpoint
    // data should still be returned. log the error and move on
    log.error(e);
  }

  return {
    metadata: hostMetadata,
    host_status: hostStatus,
    policy_info: policyInfo,
    query_strategy_version: metadataQueryStrategyVersion
  };
}