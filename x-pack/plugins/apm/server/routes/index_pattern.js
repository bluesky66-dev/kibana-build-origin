"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.apmIndexPatternTitleRoute = exports.dynamicIndexPatternRoute = exports.staticIndexPatternRoute = void 0;

var _create_static_index_pattern = require("../lib/index_pattern/create_static_index_pattern");

var _create_route = require("./create_route");

var _setup_request = require("../lib/helpers/setup_request");

var _get_internal_saved_objects_client = require("../lib/helpers/get_internal_saved_objects_client");

var _get_apm_index_pattern_title = require("../lib/index_pattern/get_apm_index_pattern_title");

var _get_dynamic_index_pattern = require("../lib/index_pattern/get_dynamic_index_pattern");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const staticIndexPatternRoute = (0, _create_route.createRoute)(core => ({
  endpoint: 'POST /api/apm/index_pattern/static',
  options: {
    tags: ['access:apm']
  },
  handler: async ({
    context,
    request
  }) => {
    const [setup, savedObjectsClient] = await Promise.all([(0, _setup_request.setupRequest)(context, request), (0, _get_internal_saved_objects_client.getInternalSavedObjectsClient)(core)]);
    await (0, _create_static_index_pattern.createStaticIndexPattern)(setup, context, savedObjectsClient); // send empty response regardless of outcome

    return undefined;
  }
}));
exports.staticIndexPatternRoute = staticIndexPatternRoute;
const dynamicIndexPatternRoute = (0, _create_route.createRoute)({
  endpoint: 'GET /api/apm/index_pattern/dynamic',
  options: {
    tags: ['access:apm']
  },
  handler: async ({
    context
  }) => {
    const dynamicIndexPattern = await (0, _get_dynamic_index_pattern.getDynamicIndexPattern)({
      context
    });
    return {
      dynamicIndexPattern
    };
  }
});
exports.dynamicIndexPatternRoute = dynamicIndexPatternRoute;
const apmIndexPatternTitleRoute = (0, _create_route.createRoute)({
  endpoint: 'GET /api/apm/index_pattern/title',
  options: {
    tags: ['access:apm']
  },
  handler: async ({
    context
  }) => {
    return (0, _get_apm_index_pattern_title.getApmIndexPatternTitle)(context);
  }
});
exports.apmIndexPatternTitleRoute = apmIndexPatternTitleRoute;