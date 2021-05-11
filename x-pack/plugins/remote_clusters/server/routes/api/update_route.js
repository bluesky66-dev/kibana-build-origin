"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.register = void 0;

var _lodash = require("lodash");

var _configSchema = require("@kbn/config-schema");

var _i18n = require("@kbn/i18n");

var _constants = require("../../../common/constants");

var _lib = require("../../../common/lib");

var _does_cluster_exist = require("../../lib/does_cluster_exist");

var _license_pre_routing_factory = require("../../lib/license_pre_routing_factory");

var _shared_imports = require("../../shared_imports");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const bodyValidation = _configSchema.schema.object({
  skipUnavailable: _configSchema.schema.boolean(),
  mode: _configSchema.schema.oneOf([_configSchema.schema.literal(_constants.PROXY_MODE), _configSchema.schema.literal(_constants.SNIFF_MODE)]),
  seeds: _configSchema.schema.nullable(_configSchema.schema.arrayOf(_configSchema.schema.string())),
  nodeConnections: _configSchema.schema.nullable(_configSchema.schema.number()),
  proxyAddress: _configSchema.schema.nullable(_configSchema.schema.string()),
  proxySocketConnections: _configSchema.schema.nullable(_configSchema.schema.number()),
  serverName: _configSchema.schema.nullable(_configSchema.schema.string()),
  hasDeprecatedProxySetting: _configSchema.schema.maybe(_configSchema.schema.boolean())
});

const paramsValidation = _configSchema.schema.object({
  name: _configSchema.schema.string()
});

const register = deps => {
  const updateHandler = async (ctx, request, response) => {
    try {
      const callAsCurrentUser = ctx.core.elasticsearch.legacy.client.callAsCurrentUser;
      const {
        name
      } = request.params; // Check if cluster does exist.

      const existingCluster = await (0, _does_cluster_exist.doesClusterExist)(callAsCurrentUser, name);

      if (!existingCluster) {
        return response.notFound({
          body: {
            message: _i18n.i18n.translate('xpack.remoteClusters.updateRemoteCluster.noRemoteClusterErrorMessage', {
              defaultMessage: 'There is no remote cluster with that name.'
            })
          }
        });
      } // Update cluster as new settings


      const updateClusterPayload = (0, _lib.serializeCluster)({ ...request.body,
        name
      });
      const updateClusterResponse = await callAsCurrentUser('cluster.putSettings', {
        body: updateClusterPayload
      });
      const acknowledged = (0, _lodash.get)(updateClusterResponse, 'acknowledged');
      const cluster = (0, _lodash.get)(updateClusterResponse, `persistent.cluster.remote.${name}`);

      if (acknowledged && cluster) {
        const body = { ...(0, _lib.deserializeCluster)(name, cluster),
          isConfiguredByNode: false
        };
        return response.ok({
          body
        });
      } // If for some reason the ES response did not acknowledge,
      // return an error. This shouldn't happen.


      return response.customError({
        statusCode: 400,
        body: {
          message: _i18n.i18n.translate('xpack.remoteClusters.updateRemoteCluster.unknownRemoteClusterErrorMessage', {
            defaultMessage: 'Unable to edit cluster, no response returned from ES.'
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

  deps.router.put({
    path: `${_constants.API_BASE_PATH}/{name}`,
    validate: {
      params: paramsValidation,
      body: bodyValidation
    }
  }, (0, _license_pre_routing_factory.licensePreRoutingFactory)(deps, updateHandler));
};

exports.register = register;