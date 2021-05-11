"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "FleetSetupContract", {
  enumerable: true,
  get: function () {
    return _plugin.FleetSetupContract;
  }
});
Object.defineProperty(exports, "FleetSetupDeps", {
  enumerable: true,
  get: function () {
    return _plugin.FleetSetupDeps;
  }
});
Object.defineProperty(exports, "FleetStartContract", {
  enumerable: true,
  get: function () {
    return _plugin.FleetStartContract;
  }
});
Object.defineProperty(exports, "ExternalCallback", {
  enumerable: true,
  get: function () {
    return _plugin.ExternalCallback;
  }
});
Object.defineProperty(exports, "apm", {
  enumerable: true,
  get: function () {
    return _elasticApmNode.default;
  }
});
Object.defineProperty(exports, "AgentService", {
  enumerable: true,
  get: function () {
    return _services.AgentService;
  }
});
Object.defineProperty(exports, "ESIndexPatternService", {
  enumerable: true,
  get: function () {
    return _services.ESIndexPatternService;
  }
});
Object.defineProperty(exports, "getRegistryUrl", {
  enumerable: true,
  get: function () {
    return _services.getRegistryUrl;
  }
});
Object.defineProperty(exports, "PackageService", {
  enumerable: true,
  get: function () {
    return _services.PackageService;
  }
});
Object.defineProperty(exports, "AgentPolicyServiceInterface", {
  enumerable: true,
  get: function () {
    return _services.AgentPolicyServiceInterface;
  }
});
Object.defineProperty(exports, "PackagePolicyServiceInterface", {
  enumerable: true,
  get: function () {
    return _package_policy.PackagePolicyServiceInterface;
  }
});
exports.plugin = exports.config = void 0;

var _configSchema = require("@kbn/config-schema");

var _plugin = require("./plugin");

var _common = require("../common");

var _elasticApmNode = _interopRequireDefault(require("elastic-apm-node"));

var _services = require("./services");

var _package_policy = require("./services/package_policy");

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


const config = {
  exposeToBrowser: {
    epm: true,
    agents: true
  },
  deprecations: ({
    renameFromRoot
  }) => [renameFromRoot('xpack.ingestManager', 'xpack.fleet'), renameFromRoot('xpack.fleet.fleet', 'xpack.fleet.agents')],
  schema: _configSchema.schema.object({
    enabled: _configSchema.schema.boolean({
      defaultValue: true
    }),
    registryUrl: _configSchema.schema.maybe(_configSchema.schema.uri({
      scheme: ['http', 'https']
    })),
    registryProxyUrl: _configSchema.schema.maybe(_configSchema.schema.uri({
      scheme: ['http', 'https']
    })),
    agents: _configSchema.schema.object({
      enabled: _configSchema.schema.boolean({
        defaultValue: true
      }),
      fleetServerEnabled: _configSchema.schema.boolean({
        defaultValue: false
      }),
      tlsCheckDisabled: _configSchema.schema.boolean({
        defaultValue: false
      }),
      pollingRequestTimeout: _configSchema.schema.number({
        defaultValue: _common.AGENT_POLLING_REQUEST_TIMEOUT_MS,
        min: 5000
      }),
      maxConcurrentConnections: _configSchema.schema.number({
        defaultValue: 0
      }),
      kibana: _configSchema.schema.object({
        host: _configSchema.schema.maybe(_configSchema.schema.oneOf([_configSchema.schema.uri({
          scheme: ['http', 'https']
        }), _configSchema.schema.arrayOf(_configSchema.schema.uri({
          scheme: ['http', 'https']
        }), {
          minSize: 1
        })])),
        ca_sha256: _configSchema.schema.maybe(_configSchema.schema.string())
      }),
      elasticsearch: _configSchema.schema.object({
        host: _configSchema.schema.maybe(_configSchema.schema.string()),
        ca_sha256: _configSchema.schema.maybe(_configSchema.schema.string())
      }),
      agentPolicyRolloutRateLimitIntervalMs: _configSchema.schema.number({
        defaultValue: _common.AGENT_POLICY_ROLLOUT_RATE_LIMIT_INTERVAL_MS
      }),
      agentPolicyRolloutRateLimitRequestPerInterval: _configSchema.schema.number({
        defaultValue: _common.AGENT_POLICY_ROLLOUT_RATE_LIMIT_REQUEST_PER_INTERVAL
      })
    })
  })
};
exports.config = config;

const plugin = initializerContext => {
  return new _plugin.FleetPlugin(initializerContext);
};

exports.plugin = plugin;