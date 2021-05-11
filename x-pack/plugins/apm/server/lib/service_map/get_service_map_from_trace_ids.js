"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getConnections = getConnections;
exports.getServiceMapFromTraceIds = getServiceMapFromTraceIds;

var _lodash = require("lodash");

var _environment_filter_values = require("../../../common/environment_filter_values");

var _elasticsearch_fieldnames = require("../../../common/elasticsearch_fieldnames");

var _fetch_service_paths_from_trace_ids = require("./fetch_service_paths_from_trace_ids");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function getConnections({
  paths,
  serviceName,
  environment
}) {
  if (!paths) {
    return [];
  }

  if (serviceName || environment) {
    paths = paths.filter(path => {
      return path // Only apply the filter on node that contains service name, this filters out external nodes
      .filter(node => {
        return node[_elasticsearch_fieldnames.SERVICE_NAME];
      }).some(node => {
        if (serviceName && node[_elasticsearch_fieldnames.SERVICE_NAME] !== serviceName) {
          return false;
        }

        if (!environment || environment === _environment_filter_values.ENVIRONMENT_ALL.value) {
          return true;
        }

        if (environment === _environment_filter_values.ENVIRONMENT_NOT_DEFINED.value) {
          return !node[_elasticsearch_fieldnames.SERVICE_ENVIRONMENT];
        }

        return node[_elasticsearch_fieldnames.SERVICE_ENVIRONMENT] === environment;
      });
    });
  }

  const connectionsArr = paths.flatMap(path => {
    return path.reduce((conns, location, index) => {
      const prev = path[index - 1];

      if (prev) {
        return conns.concat({
          source: prev,
          destination: location
        });
      }

      return conns;
    }, []);
  }, []);
  const connections = (0, _lodash.uniqBy)(connectionsArr, value => (0, _lodash.find)(connectionsArr, value));
  return connections;
}

async function getServiceMapFromTraceIds({
  setup,
  traceIds,
  serviceName,
  environment
}) {
  var _serviceMapFromTraceI, _serviceMapScriptedAg;

  const serviceMapFromTraceIdsScriptResponse = await (0, _fetch_service_paths_from_trace_ids.fetchServicePathsFromTraceIds)(setup, traceIds);
  const serviceMapScriptedAggValue = (_serviceMapFromTraceI = serviceMapFromTraceIdsScriptResponse.aggregations) === null || _serviceMapFromTraceI === void 0 ? void 0 : _serviceMapFromTraceI.service_map.value;
  return {
    connections: getConnections({
      paths: serviceMapScriptedAggValue === null || serviceMapScriptedAggValue === void 0 ? void 0 : serviceMapScriptedAggValue.paths,
      serviceName,
      environment
    }),
    discoveredServices: (_serviceMapScriptedAg = serviceMapScriptedAggValue === null || serviceMapScriptedAggValue === void 0 ? void 0 : serviceMapScriptedAggValue.discoveredServices) !== null && _serviceMapScriptedAg !== void 0 ? _serviceMapScriptedAg : []
  };
}