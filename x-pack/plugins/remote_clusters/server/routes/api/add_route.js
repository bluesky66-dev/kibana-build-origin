"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.register = void 0;

var _lodash = require("lodash");

var _configSchema = require("@kbn/config-schema");

var _i18n = require("@kbn/i18n");

var _lib = require("../../../common/lib");

var _does_cluster_exist = require("../../lib/does_cluster_exist");

var _constants = require("../../../common/constants");

var _license_pre_routing_factory = require("../../lib/license_pre_routing_factory");

var _shared_imports = require("../../shared_imports");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const bodyValidation = _configSchema.schema.object({
  name: _configSchema.schema.string(),
  skipUnavailable: _configSchema.schema.boolean(),
  mode: _configSchema.schema.oneOf([_configSchema.schema.literal(_constants.PROXY_MODE), _configSchema.schema.literal(_constants.SNIFF_MODE)]),
  seeds: _configSchema.schema.nullable(_configSchema.schema.arrayOf(_configSchema.schema.string())),
  nodeConnections: _configSchema.schema.nullable(_configSchema.schema.number()),
  proxyAddress: _configSchema.schema.nullable(_configSchema.schema.string()),
  proxySocketConnections: _configSchema.schema.nullable(_configSchema.schema.number()),
  serverName: _configSchema.schema.nullable(_configSchema.schema.string())
});

const register = deps => {
  const addHandler = async (ctx, request, response) => {
    try {
      const callAsCurrentUser = ctx.core.elasticsearch.legacy.client.callAsCurrentUser;
      const {
        name
      } = request.body; // Check if cluster already exists.

      const existingCluster = await (0, _does_cluster_exist.doesClusterExist)(callAsCurrentUser, name);

      if (existingCluster) {
        return response.conflict({
          body: {
            message: _i18n.i18n.translate('xpack.remoteClusters.addRemoteCluster.existingRemoteClusterErrorMessage', {
              defaultMessage: 'There is already a remote cluster with that name.'
            })
          }
        });
      }

      const addClusterPayload = (0, _lib.serializeCluster)(request.body);
      const updateClusterResponse = await callAsCurrentUser('cluster.putSettings', {
        body: addClusterPayload
      });
      const acknowledged = (0, _lodash.get)(updateClusterResponse, 'acknowledged');
      const cluster = (0, _lodash.get)(updateClusterResponse, `persistent.cluster.remote.${name}`);

      if (acknowledged && cluster) {
        return response.ok({
          body: {
            acknowledged: true
          }
        });
      } // If for some reason the ES response did not acknowledge,
      // return an error. This shouldn't happen.


      return response.customError({
        statusCode: 400,
        body: {
          message: _i18n.i18n.translate('xpack.remoteClusters.addRemoteCluster.unknownRemoteClusterErrorMessage', {
            defaultMessage: 'Unable to add cluster, no response returned from ES.'
          })
        }
      });
    } catch (error) {
      if ((0, _shared_imports.isEsError)(error)) {
        return response.customError({
          statusCode: error.statusCode,
          body: error
        });
      }

      return response.internalError({
        body: error
      });
    }
  };

  deps.router.post({
    path: _constants.API_BASE_PATH,
    validate: {
      body: bodyValidation
    }
  }, (0, _license_pre_routing_factory.licensePreRoutingFactory)(deps, addHandler));
};

exports.register = register;