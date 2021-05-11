"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.serviceNodesRoute = void 0;

var t = _interopRequireWildcard(require("io-ts"));

var _create_route = require("./create_route");

var _setup_request = require("../lib/helpers/setup_request");

var _service_nodes = require("../lib/service_nodes");

var _default_api_types = require("./default_api_types");

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


const serviceNodesRoute = (0, _create_route.createRoute)({
  endpoint: 'GET /api/apm/services/{serviceName}/serviceNodes',
  params: t.type({
    path: t.type({
      serviceName: t.string
    }),
    query: t.intersection([_default_api_types.rangeRt, _default_api_types.uiFiltersRt])
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
      params
    } = context;
    const {
      serviceName
    } = params.path;
    return (0, _service_nodes.getServiceNodes)({
      setup,
      serviceName
    });
  }
});
exports.serviceNodesRoute = serviceNodesRoute;