"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAgentPolicySummaryHandler = exports.getHostPolicyResponseHandler = void 0;

var _constants = require("../../../../common/endpoint/constants");

var _service = require("./service");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const getHostPolicyResponseHandler = function (endpointAppContext) {
  return async (context, request, response) => {
    try {
      const doc = await (0, _service.getPolicyResponseByAgentId)(_constants.policyIndexPattern, request.query.agentId, context.core.elasticsearch.legacy.client);

      if (doc) {
        return response.ok({
          body: doc
        });
      }

      return response.notFound({
        body: 'Policy Response Not Found'
      });
    } catch (err) {
      return response.internalError({
        body: err
      });
    }
  };
};

exports.getHostPolicyResponseHandler = getHostPolicyResponseHandler;

const getAgentPolicySummaryHandler = function (endpointAppContext) {
  return async (context, request, response) => {
    try {
      var _request$query, _request$query2, _request$query3;

      const result = await (0, _service.getAgentPolicySummary)(endpointAppContext, context.core.savedObjects.client, context.core.elasticsearch.client.asCurrentUser, request.query.package_name, ((_request$query = request.query) === null || _request$query === void 0 ? void 0 : _request$query.policy_id) || undefined);
      const responseBody = {
        package: request.query.package_name,
        versions_count: { ...result
        }
      };
      const body = {
        summary_response: (_request$query2 = request.query) !== null && _request$query2 !== void 0 && _request$query2.policy_id ? { ...responseBody,
          ...{
            policy_id: (_request$query3 = request.query) === null || _request$query3 === void 0 ? void 0 : _request$query3.policy_id
          }
        } : responseBody
      };
      return response.ok({
        body
      });
    } catch (err) {
      endpointAppContext.logFactory.get('metadata').error(JSON.stringify(err, null, 2));
      return response.internalError({
        body: err
      });
    }
  };
};

exports.getAgentPolicySummaryHandler = getAgentPolicySummaryHandler;