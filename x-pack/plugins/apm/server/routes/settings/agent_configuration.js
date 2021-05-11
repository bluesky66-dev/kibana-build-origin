"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.agentConfigurationAgentNameRoute = exports.listAgentConfigurationEnvironmentsRoute = exports.listAgentConfigurationServicesRoute = exports.agentConfigurationSearchRoute = exports.createOrUpdateAgentConfigurationRoute = exports.deleteAgentConfigurationRoute = exports.getSingleAgentConfigurationRoute = exports.agentConfigurationRoute = void 0;

var t = _interopRequireWildcard(require("io-ts"));

var _boom = _interopRequireDefault(require("@hapi/boom"));

var _to_boolean_rt = require("../../../common/runtime_types/to_boolean_rt");

var _setup_request = require("../../lib/helpers/setup_request");

var _get_service_names = require("../../lib/settings/agent_configuration/get_service_names");

var _create_or_update_configuration = require("../../lib/settings/agent_configuration/create_or_update_configuration");

var _search_configurations = require("../../lib/settings/agent_configuration/search_configurations");

var _find_exact_configuration = require("../../lib/settings/agent_configuration/find_exact_configuration");

var _list_configurations = require("../../lib/settings/agent_configuration/list_configurations");

var _get_environments = require("../../lib/settings/agent_configuration/get_environments");

var _delete_configuration = require("../../lib/settings/agent_configuration/delete_configuration");

var _create_route = require("../create_route");

var _get_agent_name_by_service = require("../../lib/settings/agent_configuration/get_agent_name_by_service");

var _mark_applied_by_agent = require("../../lib/settings/agent_configuration/mark_applied_by_agent");

var _agent_configuration_intake_rt = require("../../../common/agent_configuration/runtime_types/agent_configuration_intake_rt");

var _aggregated_transactions = require("../../lib/helpers/aggregated_transactions");

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}

function _getRequireWildcardCache() {
  if (typeof WeakMap !== "function") return null;
  var cache = new WeakMap();

  _getRequireWildcardCache = function () {
    return cache;
  };

  return cache;
}

function _interopRequireWildcard(obj) {
  if (obj && obj.__esModule) {
    return obj;
  }

  if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
    return {
      default: obj
    };
  }

  var cache = _getRequireWildcardCache();

  if (cache && cache.has(obj)) {
    return cache.get(obj);
  }

  var newObj = {};
  var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;

  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;

      if (desc && (desc.get || desc.set)) {
        Object.defineProperty(newObj, key, desc);
      } else {
        newObj[key] = obj[key];
      }
    }
  }

  newObj.default = obj;

  if (cache) {
    cache.set(obj, newObj);
  }

  return newObj;
}
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// get list of configurations


const agentConfigurationRoute = (0, _create_route.createRoute)({
  endpoint: 'GET /api/apm/settings/agent-configuration',
  options: {
    tags: ['access:apm']
  },
  handler: async ({
    context,
    request
  }) => {
    const setup = await (0, _setup_request.setupRequest)(context, request);
    return await (0, _list_configurations.listConfigurations)({
      setup
    });
  }
}); // get a single configuration

exports.agentConfigurationRoute = agentConfigurationRoute;
const getSingleAgentConfigurationRoute = (0, _create_route.createRoute)({
  endpoint: 'GET /api/apm/settings/agent-configuration/view',
  params: t.partial({
    query: _agent_configuration_intake_rt.serviceRt
  }),
  options: {
    tags: ['access:apm']
  },
  handler: async ({
    context,
    request
  }) => {
    const setup = await (0, _setup_request.setupRequest)(context, request);
    const {
      name,
      environment
    } = context.params.query;
    const service = {
      name,
      environment
    };
    const config = await (0, _find_exact_configuration.findExactConfiguration)({
      service,
      setup
    });

    if (!config) {
      context.logger.info(`Config was not found for ${service.name}/${service.environment}`);
      throw _boom.default.notFound();
    }

    return config._source;
  }
}); // delete configuration

exports.getSingleAgentConfigurationRoute = getSingleAgentConfigurationRoute;
const deleteAgentConfigurationRoute = (0, _create_route.createRoute)({
  endpoint: 'DELETE /api/apm/settings/agent-configuration',
  options: {
    tags: ['access:apm', 'access:apm_write']
  },
  params: t.type({
    body: t.type({
      service: _agent_configuration_intake_rt.serviceRt
    })
  }),
  handler: async ({
    context,
    request
  }) => {
    const setup = await (0, _setup_request.setupRequest)(context, request);
    const {
      service
    } = context.params.body;
    const config = await (0, _find_exact_configuration.findExactConfiguration)({
      service,
      setup
    });

    if (!config) {
      context.logger.info(`Config was not found for ${service.name}/${service.environment}`);
      throw _boom.default.notFound();
    }

    context.logger.info(`Deleting config ${service.name}/${service.environment} (${config._id})`);
    return await (0, _delete_configuration.deleteConfiguration)({
      configurationId: config._id,
      setup
    });
  }
}); // create/update configuration

exports.deleteAgentConfigurationRoute = deleteAgentConfigurationRoute;
const createOrUpdateAgentConfigurationRoute = (0, _create_route.createRoute)({
  endpoint: 'PUT /api/apm/settings/agent-configuration',
  options: {
    tags: ['access:apm', 'access:apm_write']
  },
  params: t.intersection([t.partial({
    query: t.partial({
      overwrite: _to_boolean_rt.toBooleanRt
    })
  }), t.type({
    body: _agent_configuration_intake_rt.agentConfigurationIntakeRt
  })]),
  handler: async ({
    context,
    request
  }) => {
    const setup = await (0, _setup_request.setupRequest)(context, request);
    const {
      body,
      query
    } = context.params; // if the config already exists, it is fetched and updated
    // this is to avoid creating two configs with identical service params

    const config = await (0, _find_exact_configuration.findExactConfiguration)({
      service: body.service,
      setup
    }); // if the config exists ?overwrite=true is required

    if (config && !query.overwrite) {
      throw _boom.default.badRequest(`A configuration already exists for "${body.service.name}/${body.service.environment}. Use ?overwrite=true to overwrite the existing configuration.`);
    }

    context.logger.info(`${config ? 'Updating' : 'Creating'} config ${body.service.name}/${body.service.environment}`);
    return await (0, _create_or_update_configuration.createOrUpdateConfiguration)({
      configurationId: config === null || config === void 0 ? void 0 : config._id,
      configurationIntake: body,
      setup
    });
  }
});
exports.createOrUpdateAgentConfigurationRoute = createOrUpdateAgentConfigurationRoute;
const searchParamsRt = t.intersection([t.type({
  service: _agent_configuration_intake_rt.serviceRt
}), t.partial({
  etag: t.string,
  mark_as_applied_by_agent: t.boolean
})]); // Lookup single configuration (used by APM Server)

const agentConfigurationSearchRoute = (0, _create_route.createRoute)({
  endpoint: 'POST /api/apm/settings/agent-configuration/search',
  params: t.type({
    body: searchParamsRt
  }),
  options: {
    tags: ['access:apm']
  },
  handler: async ({
    context,
    request
  }) => {
    const {
      service,
      etag,
      mark_as_applied_by_agent: markAsAppliedByAgent
    } = context.params.body;
    const setup = await (0, _setup_request.setupRequest)(context, request);
    const config = await (0, _search_configurations.searchConfigurations)({
      service,
      setup
    });

    if (!config) {
      context.logger.info(`Config was not found for ${service.name}/${service.environment}`);
      throw _boom.default.notFound();
    }

    context.logger.info(`Config was found for ${service.name}/${service.environment}`); // update `applied_by_agent` field
    // when `markAsAppliedByAgent` is true (Jaeger agent doesn't have etags)
    // or if etags match.
    // this happens in the background and doesn't block the response

    if ((markAsAppliedByAgent || etag === config._source.etag) && !config._source.applied_by_agent) {
      (0, _mark_applied_by_agent.markAppliedByAgent)({
        id: config._id,
        body: config._source,
        setup
      });
    }

    return config;
  }
});
/*
 * Utility endpoints (not documented as part of the public API)
 */
// get list of services

exports.agentConfigurationSearchRoute = agentConfigurationSearchRoute;
const listAgentConfigurationServicesRoute = (0, _create_route.createRoute)({
  endpoint: 'GET /api/apm/settings/agent-configuration/services',
  options: {
    tags: ['access:apm']
  },
  handler: async ({
    context,
    request
  }) => {
    const setup = await (0, _setup_request.setupRequest)(context, request);
    const searchAggregatedTransactions = await (0, _aggregated_transactions.getSearchAggregatedTransactions)(setup);
    return await (0, _get_service_names.getServiceNames)({
      setup,
      searchAggregatedTransactions
    });
  }
}); // get environments for service

exports.listAgentConfigurationServicesRoute = listAgentConfigurationServicesRoute;
const listAgentConfigurationEnvironmentsRoute = (0, _create_route.createRoute)({
  endpoint: 'GET /api/apm/settings/agent-configuration/environments',
  params: t.partial({
    query: t.partial({
      serviceName: t.string
    })
  }),
  options: {
    tags: ['access:apm']
  },
  handler: async ({
    context,
    request
  }) => {
    const setup = await (0, _setup_request.setupRequest)(context, request);
    const {
      serviceName
    } = context.params.query;
    const searchAggregatedTransactions = await (0, _aggregated_transactions.getSearchAggregatedTransactions)(setup);
    return await (0, _get_environments.getEnvironments)({
      serviceName,
      setup,
      searchAggregatedTransactions
    });
  }
}); // get agentName for service

exports.listAgentConfigurationEnvironmentsRoute = listAgentConfigurationEnvironmentsRoute;
const agentConfigurationAgentNameRoute = (0, _create_route.createRoute)({
  endpoint: 'GET /api/apm/settings/agent-configuration/agent_name',
  params: t.type({
    query: t.type({
      serviceName: t.string
    })
  }),
  options: {
    tags: ['access:apm']
  },
  handler: async ({
    context,
    request
  }) => {
    const setup = await (0, _setup_request.setupRequest)(context, request);
    const {
      serviceName
    } = context.params.query;
    const agentName = await (0, _get_agent_name_by_service.getAgentNameByService)({
      serviceName,
      setup
    });
    return {
      agentName
    };
  }
});
exports.agentConfigurationAgentNameRoute = agentConfigurationAgentNameRoute;