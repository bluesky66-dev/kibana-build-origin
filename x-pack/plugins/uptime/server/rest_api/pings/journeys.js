"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createJourneyFailedStepsRoute = exports.createJourneyRoute = void 0;

var _configSchema = require("@kbn/config-schema");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const createJourneyRoute = libs => ({
  method: 'GET',
  path: '/api/uptime/journey/{checkGroup}',
  validate: {
    params: _configSchema.schema.object({
      checkGroup: _configSchema.schema.string(),
      _debug: _configSchema.schema.maybe(_configSchema.schema.boolean())
    }),
    query: _configSchema.schema.object({
      // provides a filter for the types of synthetic events to include
      // when fetching a journey's data
      syntheticEventTypes: _configSchema.schema.maybe(_configSchema.schema.oneOf([_configSchema.schema.arrayOf(_configSchema.schema.string()), _configSchema.schema.string()]))
    })
  },
  handler: async ({
    uptimeEsClient,
    request
  }) => {
    const {
      checkGroup
    } = request.params;
    const {
      syntheticEventTypes
    } = request.query;
    const result = await libs.requests.getJourneySteps({
      uptimeEsClient,
      checkGroup,
      syntheticEventTypes
    });
    const details = await libs.requests.getJourneyDetails({
      uptimeEsClient,
      checkGroup
    });
    return {
      checkGroup,
      steps: result,
      details
    };
  }
});

exports.createJourneyRoute = createJourneyRoute;

const createJourneyFailedStepsRoute = libs => ({
  method: 'GET',
  path: '/api/uptime/journeys/failed_steps',
  validate: {
    query: _configSchema.schema.object({
      checkGroups: _configSchema.schema.arrayOf(_configSchema.schema.string())
    })
  },
  handler: async ({
    uptimeEsClient,
    request
  }) => {
    const {
      checkGroups
    } = request.query;
    const result = await libs.requests.getJourneyFailedSteps({
      uptimeEsClient,
      checkGroups
    });
    return {
      checkGroups,
      steps: result
    };
  }
});

exports.createJourneyFailedStepsRoute = createJourneyFailedStepsRoute;