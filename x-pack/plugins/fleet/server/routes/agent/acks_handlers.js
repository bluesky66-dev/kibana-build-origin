"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.postAgentAcksHandlerBuilder = void 0;

var _errors = require("../../errors");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// handlers that handle events from agents in response to actions received


const postAgentAcksHandlerBuilder = function (ackService) {
  return async (context, request, response) => {
    try {
      const soClient = ackService.getSavedObjectsClientContract(request);
      const esClient = ackService.getElasticsearchClientContract();
      const agent = await ackService.authenticateAgentWithAccessToken(soClient, esClient, request);
      const agentEvents = request.body.events; // validate that all events are for the authorized agent obtained from the api key

      const notAuthorizedAgentEvent = agentEvents.filter(agentEvent => agentEvent.agent_id !== agent.id);

      if (notAuthorizedAgentEvent && notAuthorizedAgentEvent.length > 0) {
        return response.badRequest({
          body: 'agent events contains events with different agent id from currently authorized agent'
        });
      }

      const agentActions = await ackService.acknowledgeAgentActions(soClient, esClient, agent, agentEvents);

      if (agentActions.length > 0) {
        await ackService.saveAgentEvents(soClient, agentEvents);
      }

      const body = {
        action: 'acks'
      };
      return response.ok({
        body
      });
    } catch (error) {
      return (0, _errors.defaultIngestErrorHandler)({
        error,
        response
      });
    }
  };
};

exports.postAgentAcksHandlerBuilder = postAgentAcksHandlerBuilder;