"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getEnvironments = getEnvironments;

var _with_apm_span = require("../../../../utils/with_apm_span");

var _get_all_environments = require("../../../environments/get_all_environments");

var _get_existing_environments_for_service = require("./get_existing_environments_for_service");

var _all_option = require("../../../../../common/agent_configuration/all_option");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function getEnvironments({
  serviceName,
  setup,
  searchAggregatedTransactions
}) {
  return (0, _with_apm_span.withApmSpan)('get_environments_for_agent_configuration', async () => {
    const [allEnvironments, existingEnvironments] = await Promise.all([(0, _get_all_environments.getAllEnvironments)({
      serviceName,
      setup,
      searchAggregatedTransactions
    }), (0, _get_existing_environments_for_service.getExistingEnvironmentsForService)({
      serviceName,
      setup
    })]);
    return [_all_option.ALL_OPTION_VALUE, ...allEnvironments].map(environment => {
      return {
        name: environment,
        alreadyConfigured: existingEnvironments.includes(environment)
      };
    });
  });
}