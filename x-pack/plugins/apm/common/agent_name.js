"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isJavaAgentName = isJavaAgentName;
exports.isRumAgentName = isRumAgentName;
exports.RUM_AGENT_NAMES = exports.AGENT_NAMES = exports.OPEN_TELEMETRY_AGENT_NAMES = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/*
 * Agent names can be any string. This list only defines the official agents
 * that we might want to target specifically eg. linking to their documentation
 * & telemetry reporting. Support additional agent types by appending
 * definitions in mappings.json (for telemetry), the AgentName type, and the
 * AGENT_NAMES array.
 */

const OPEN_TELEMETRY_AGENT_NAMES = ['otlp', 'opentelemetry/cpp', 'opentelemetry/dotnet', 'opentelemetry/erlang', 'opentelemetry/go', 'opentelemetry/java', 'opentelemetry/nodejs', 'opentelemetry/php', 'opentelemetry/python', 'opentelemetry/ruby', 'opentelemetry/webjs'];
exports.OPEN_TELEMETRY_AGENT_NAMES = OPEN_TELEMETRY_AGENT_NAMES;
const AGENT_NAMES = ['dotnet', 'go', 'java', 'js-base', 'nodejs', 'python', 'ruby', 'rum-js', ...OPEN_TELEMETRY_AGENT_NAMES];
exports.AGENT_NAMES = AGENT_NAMES;
const RUM_AGENT_NAMES = ['js-base', 'rum-js', 'opentelemetry/webjs'];
exports.RUM_AGENT_NAMES = RUM_AGENT_NAMES;

function isJavaAgentName(agentName) {
  return agentName === 'java';
}

function isRumAgentName(agentName) {
  return RUM_AGENT_NAMES.includes(agentName);
}