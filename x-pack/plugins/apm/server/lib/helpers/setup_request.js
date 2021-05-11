"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setupRequest = setupRequest;

var _license_check = require("../../../common/license_check");

var _common = require("../../../../../../src/plugins/data/common");

var _get_apm_indices = require("../settings/apm_indices/get_apm_indices");

var _get_es_filter = require("./convert_ui_filters/get_es_filter");

var _create_apm_event_client = require("./create_es_client/create_apm_event_client");

var _create_internal_es_client = require("./create_es_client/create_internal_es_client");

var _with_apm_span = require("../../utils/with_apm_span");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function setupRequest(context, request) {
  return (0, _with_apm_span.withApmSpan)('setup_request', async () => {
    const {
      config,
      logger
    } = context;
    const {
      query
    } = context.params;
    const [indices, includeFrozen] = await Promise.all([(0, _get_apm_indices.getApmIndices)({
      savedObjectsClient: context.core.savedObjects.client,
      config
    }), (0, _with_apm_span.withApmSpan)('get_ui_settings', () => context.core.uiSettings.client.get(_common.UI_SETTINGS.SEARCH_INCLUDE_FROZEN))]);
    const uiFilters = decodeUiFilters(logger, query.uiFilters);
    const coreSetupRequest = {
      indices,
      apmEventClient: (0, _create_apm_event_client.createApmEventClient)({
        esClient: context.core.elasticsearch.client.asCurrentUser,
        debug: context.params.query._debug,
        request,
        indices,
        options: {
          includeFrozen
        }
      }),
      internalClient: (0, _create_internal_es_client.createInternalESClient)({
        context,
        request
      }),
      ml: context.plugins.ml && (0, _license_check.isActivePlatinumLicense)(context.licensing.license) ? getMlSetup(context.plugins.ml, context.core.savedObjects.client, request) : undefined,
      config,
      uiFilters,
      esFilter: (0, _get_es_filter.getEsFilter)(uiFilters)
    };
    return { ...('start' in query ? {
        start: query.start
      } : {}),
      ...('end' in query ? {
        end: query.end
      } : {}),
      ...coreSetupRequest
    };
  });
}

function getMlSetup(ml, savedObjectsClient, request) {
  return {
    mlSystem: ml.mlSystemProvider(request, savedObjectsClient),
    anomalyDetectors: ml.anomalyDetectorsProvider(request, savedObjectsClient),
    modules: ml.modulesProvider(request, savedObjectsClient)
  };
}

function decodeUiFilters(logger, uiFiltersEncoded) {
  if (!uiFiltersEncoded) {
    return {};
  }

  try {
    return JSON.parse(uiFiltersEncoded);
  } catch (error) {
    logger.error(error);
    return {};
  }
}