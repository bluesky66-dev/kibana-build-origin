"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AGENT_POLICY_SUMMARY_ROUTE = exports.BASE_POLICY_ROUTE = exports.BASE_POLICY_RESPONSE_ROUTE = exports.TRUSTED_APPS_SUMMARY_API = exports.TRUSTED_APPS_DELETE_API = exports.TRUSTED_APPS_CREATE_API = exports.TRUSTED_APPS_LIST_API = exports.LIMITED_CONCURRENCY_ENDPOINT_COUNT = exports.LIMITED_CONCURRENCY_ENDPOINT_ROUTE_TAG = exports.telemetryIndexPattern = exports.policyIndexPattern = exports.metadataTransformPrefix = exports.metadataCurrentIndexPattern = exports.metadataIndexPattern = exports.alertsIndexPattern = exports.eventsIndexPattern = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const eventsIndexPattern = 'logs-endpoint.events.*';
exports.eventsIndexPattern = eventsIndexPattern;
const alertsIndexPattern = 'logs-endpoint.alerts-*';
exports.alertsIndexPattern = alertsIndexPattern;
const metadataIndexPattern = 'metrics-endpoint.metadata-*';
exports.metadataIndexPattern = metadataIndexPattern;
const metadataCurrentIndexPattern = 'metrics-endpoint.metadata_current_*';
exports.metadataCurrentIndexPattern = metadataCurrentIndexPattern;
const metadataTransformPrefix = 'endpoint.metadata_current-default';
exports.metadataTransformPrefix = metadataTransformPrefix;
const policyIndexPattern = 'metrics-endpoint.policy-*';
exports.policyIndexPattern = policyIndexPattern;
const telemetryIndexPattern = 'metrics-endpoint.telemetry-*';
exports.telemetryIndexPattern = telemetryIndexPattern;
const LIMITED_CONCURRENCY_ENDPOINT_ROUTE_TAG = 'endpoint:limited-concurrency';
exports.LIMITED_CONCURRENCY_ENDPOINT_ROUTE_TAG = LIMITED_CONCURRENCY_ENDPOINT_ROUTE_TAG;
const LIMITED_CONCURRENCY_ENDPOINT_COUNT = 100;
exports.LIMITED_CONCURRENCY_ENDPOINT_COUNT = LIMITED_CONCURRENCY_ENDPOINT_COUNT;
const TRUSTED_APPS_LIST_API = '/api/endpoint/trusted_apps';
exports.TRUSTED_APPS_LIST_API = TRUSTED_APPS_LIST_API;
const TRUSTED_APPS_CREATE_API = '/api/endpoint/trusted_apps';
exports.TRUSTED_APPS_CREATE_API = TRUSTED_APPS_CREATE_API;
const TRUSTED_APPS_DELETE_API = '/api/endpoint/trusted_apps/{id}';
exports.TRUSTED_APPS_DELETE_API = TRUSTED_APPS_DELETE_API;
const TRUSTED_APPS_SUMMARY_API = '/api/endpoint/trusted_apps/summary';
exports.TRUSTED_APPS_SUMMARY_API = TRUSTED_APPS_SUMMARY_API;
const BASE_POLICY_RESPONSE_ROUTE = `/api/endpoint/policy_response`;
exports.BASE_POLICY_RESPONSE_ROUTE = BASE_POLICY_RESPONSE_ROUTE;
const BASE_POLICY_ROUTE = `/api/endpoint/policy`;
exports.BASE_POLICY_ROUTE = BASE_POLICY_ROUTE;
const AGENT_POLICY_SUMMARY_ROUTE = `${BASE_POLICY_ROUTE}/summaries`;
exports.AGENT_POLICY_SUMMARY_ROUTE = AGENT_POLICY_SUMMARY_ROUTE;