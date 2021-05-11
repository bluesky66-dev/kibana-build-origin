"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getApmIndicesConfig = getApmIndicesConfig;
exports.getApmIndices = getApmIndices;
exports.getApmIndexSettings = getApmIndexSettings;

var _lodash = require("lodash");

var _apm_saved_object_constants = require("../../../../common/apm_saved_object_constants");

var _with_apm_span = require("../../../utils/with_apm_span");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function getApmIndicesSavedObject(savedObjectsClient) {
  const apmIndices = await (0, _with_apm_span.withApmSpan)('get_apm_indices_saved_object', () => savedObjectsClient.get(_apm_saved_object_constants.APM_INDICES_SAVED_OBJECT_TYPE, _apm_saved_object_constants.APM_INDICES_SAVED_OBJECT_ID));
  return apmIndices.attributes;
}

function getApmIndicesConfig(config) {
  return {
    /* eslint-disable @typescript-eslint/naming-convention */
    'apm_oss.sourcemapIndices': config['apm_oss.sourcemapIndices'],
    'apm_oss.errorIndices': config['apm_oss.errorIndices'],
    'apm_oss.onboardingIndices': config['apm_oss.onboardingIndices'],
    'apm_oss.spanIndices': config['apm_oss.spanIndices'],
    'apm_oss.transactionIndices': config['apm_oss.transactionIndices'],
    'apm_oss.metricsIndices': config['apm_oss.metricsIndices'],

    /* eslint-enable @typescript-eslint/naming-convention */
    // system indices, not configurable
    apmAgentConfigurationIndex: '.apm-agent-configuration',
    apmCustomLinkIndex: '.apm-custom-link'
  };
}

async function getApmIndices({
  config,
  savedObjectsClient
}) {
  try {
    const apmIndicesSavedObject = await getApmIndicesSavedObject(savedObjectsClient);
    const apmIndicesConfig = getApmIndicesConfig(config);
    return (0, _lodash.merge)({}, apmIndicesConfig, apmIndicesSavedObject);
  } catch (error) {
    return getApmIndicesConfig(config);
  }
}

const APM_UI_INDICES = ['apm_oss.sourcemapIndices', 'apm_oss.errorIndices', 'apm_oss.onboardingIndices', 'apm_oss.spanIndices', 'apm_oss.transactionIndices', 'apm_oss.metricsIndices'];

async function getApmIndexSettings({
  context
}) {
  let apmIndicesSavedObject;

  try {
    apmIndicesSavedObject = await getApmIndicesSavedObject(context.core.savedObjects.client);
  } catch (error) {
    if (error.output && error.output.statusCode === 404) {
      apmIndicesSavedObject = {};
    } else {
      throw error;
    }
  }

  const apmIndicesConfig = getApmIndicesConfig(context.config);
  return APM_UI_INDICES.map(configurationName => ({
    configurationName,
    defaultValue: apmIndicesConfig[configurationName],
    // value defined in kibana[.dev].yml
    savedValue: apmIndicesSavedObject[configurationName] // value saved via Saved Objects service

  }));
}