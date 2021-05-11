"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.convertSettingsIntoLists = convertSettingsIntoLists;
exports.registerListRoute = registerListRoute;

var _services = require("../../../services");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function convertSettingsIntoLists(settings, disallowedNodeAttributes) {
  return Object.entries(settings.nodes).reduce((accum, [nodeId, nodeSettings]) => {
    var _nodeSettings$setting, _nodeSettings$setting2;

    const attributes = nodeSettings.attributes || {};

    for (const [key, value] of Object.entries(attributes)) {
      const isNodeAttributeAllowed = !disallowedNodeAttributes.includes(key);

      if (isNodeAttributeAllowed) {
        var _accum$nodesByAttribu;

        const attributeString = `${key}:${value}`;
        accum.nodesByAttributes[attributeString] = (_accum$nodesByAttribu = accum.nodesByAttributes[attributeString]) !== null && _accum$nodesByAttribu !== void 0 ? _accum$nodesByAttribu : [];
        accum.nodesByAttributes[attributeString].push(nodeId);
      }
    }

    const dataRoles = nodeSettings.roles.filter(r => r.startsWith('data'));

    for (const role of dataRoles) {
      var _accum$nodesByRoles$r;

      accum.nodesByRoles[role] = (_accum$nodesByRoles$r = accum.nodesByRoles[role]) !== null && _accum$nodesByRoles$r !== void 0 ? _accum$nodesByRoles$r : [];
      accum.nodesByRoles[role].push(nodeId);
    } // If we detect a single node using legacy "data:true" setting we know we are not using data roles for
    // data allocation.


    if (((_nodeSettings$setting = nodeSettings.settings) === null || _nodeSettings$setting === void 0 ? void 0 : (_nodeSettings$setting2 = _nodeSettings$setting.node) === null || _nodeSettings$setting2 === void 0 ? void 0 : _nodeSettings$setting2.data) === 'true') {
      accum.isUsingDeprecatedDataRoleConfig = true;
    }

    return accum;
  }, {
    nodesByAttributes: {},
    nodesByRoles: {},
    // Start with assumption that we are not using deprecated config
    isUsingDeprecatedDataRoleConfig: false
  });
}

function registerListRoute({
  router,
  config,
  license,
  lib: {
    handleEsError
  }
}) {
  const {
    filteredNodeAttributes
  } = config;
  const NODE_ATTRS_KEYS_TO_IGNORE = ['ml.enabled', 'ml.machine_memory', 'ml.max_open_jobs', // Used by ML to identify nodes that have transform enabled:
  // https://github.com/elastic/elasticsearch/pull/52712/files#diff-225cc2c1291b4c60a8c3412a619094e1R147
  'transform.node', 'xpack.installed'];
  const disallowedNodeAttributes = [...NODE_ATTRS_KEYS_TO_IGNORE, ...filteredNodeAttributes];
  router.get({
    path: (0, _services.addBasePath)('/nodes/list'),
    validate: false
  }, license.guardApiRoute(async (context, request, response) => {
    try {
      const settingsResponse = await context.core.elasticsearch.client.asCurrentUser.transport.request({
        method: 'GET',
        path: '/_nodes/settings',
        querystring: {
          format: 'json'
        }
      });
      const body = convertSettingsIntoLists(settingsResponse.body, disallowedNodeAttributes);
      return response.ok({
        body
      });
    } catch (error) {
      return handleEsError({
        error,
        response
      });
    }
  }));
}