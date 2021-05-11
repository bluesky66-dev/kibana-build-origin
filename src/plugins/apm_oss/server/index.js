"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.plugin = plugin;
Object.defineProperty(exports, "apmIndexPattern", {
  enumerable: true,
  get: function () {
    return _index_pattern.default;
  }
});
Object.defineProperty(exports, "APMOSSPluginSetup", {
  enumerable: true,
  get: function () {
    return _plugin.APMOSSPluginSetup;
  }
});
Object.defineProperty(exports, "APM_STATIC_INDEX_PATTERN_ID", {
  enumerable: true,
  get: function () {
    return _index_pattern_constants.APM_STATIC_INDEX_PATTERN_ID;
  }
});
Object.defineProperty(exports, "createNodeAgentInstructions", {
  enumerable: true,
  get: function () {
    return _apm_agent_instructions.createNodeAgentInstructions;
  }
});
Object.defineProperty(exports, "createDjangoAgentInstructions", {
  enumerable: true,
  get: function () {
    return _apm_agent_instructions.createDjangoAgentInstructions;
  }
});
Object.defineProperty(exports, "createFlaskAgentInstructions", {
  enumerable: true,
  get: function () {
    return _apm_agent_instructions.createFlaskAgentInstructions;
  }
});
Object.defineProperty(exports, "createRailsAgentInstructions", {
  enumerable: true,
  get: function () {
    return _apm_agent_instructions.createRailsAgentInstructions;
  }
});
Object.defineProperty(exports, "createRackAgentInstructions", {
  enumerable: true,
  get: function () {
    return _apm_agent_instructions.createRackAgentInstructions;
  }
});
Object.defineProperty(exports, "createJsAgentInstructions", {
  enumerable: true,
  get: function () {
    return _apm_agent_instructions.createJsAgentInstructions;
  }
});
Object.defineProperty(exports, "createGoAgentInstructions", {
  enumerable: true,
  get: function () {
    return _apm_agent_instructions.createGoAgentInstructions;
  }
});
Object.defineProperty(exports, "createJavaAgentInstructions", {
  enumerable: true,
  get: function () {
    return _apm_agent_instructions.createJavaAgentInstructions;
  }
});
Object.defineProperty(exports, "createDotNetAgentInstructions", {
  enumerable: true,
  get: function () {
    return _apm_agent_instructions.createDotNetAgentInstructions;
  }
});
Object.defineProperty(exports, "createPhpAgentInstructions", {
  enumerable: true,
  get: function () {
    return _apm_agent_instructions.createPhpAgentInstructions;
  }
});
exports.config = void 0;

var _configSchema = require("@kbn/config-schema");

var _index_pattern = _interopRequireDefault(require("./tutorial/index_pattern.json"));

var _plugin = require("./plugin");

var _index_pattern_constants = require("../common/index_pattern_constants");

var _apm_agent_instructions = require("./tutorial/instructions/apm_agent_instructions");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const config = {
  schema: _configSchema.schema.object({
    enabled: _configSchema.schema.boolean({
      defaultValue: true
    }),
    transactionIndices: _configSchema.schema.string({
      defaultValue: 'apm-*'
    }),
    spanIndices: _configSchema.schema.string({
      defaultValue: 'apm-*'
    }),
    errorIndices: _configSchema.schema.string({
      defaultValue: 'apm-*'
    }),
    metricsIndices: _configSchema.schema.string({
      defaultValue: 'apm-*'
    }),
    sourcemapIndices: _configSchema.schema.string({
      defaultValue: 'apm-*'
    }),
    onboardingIndices: _configSchema.schema.string({
      defaultValue: 'apm-*'
    }),
    indexPattern: _configSchema.schema.string({
      defaultValue: 'apm-*'
    }),
    fleetMode: _configSchema.schema.boolean({
      defaultValue: true
    })
  })
};
exports.config = config;

function plugin(initializerContext) {
  return new _plugin.APMOSSPlugin(initializerContext);
}