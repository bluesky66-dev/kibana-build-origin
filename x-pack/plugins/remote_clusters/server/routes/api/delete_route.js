"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.register = void 0;

var _lodash = require("lodash");

var _configSchema = require("@kbn/config-schema");

var _i18n = require("@kbn/i18n");

var _lib = require("../../../common/lib");

var _constants = require("../../../common/constants");

var _does_cluster_exist = require("../../lib/does_cluster_exist");

var _license_pre_routing_factory = require("../../lib/license_pre_routing_factory");

var _shared_imports = require("../../shared_imports");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const paramsValidation = _configSchema.schema.object({
  nameOrNames: _configSchema.schema.string()
});

const register = deps => {
  const deleteHandler = async (ctx, request, response) => {
    try {
      const callAsCurrentUser = ctx.core.elasticsearch.legacy.client.callAsCurrentUser;
      const {
        nameOrNames
      } = request.params;
      const names = nameOrNames.split(',');
      const itemsDeleted = [];
      const errors = [];
      const clusterSettings = await callAsCurrentUser('cluster.getSettings'); // Validator that returns an error if the remote cluster does not exist.

      const validateClusterDoesExist = async name => {
        try {
          const existingCluster = await (0, _does_cluster_exist.doesClusterExist)(callAsCurrentUser, name);

          if (!existingCluster) {
            return response.customError({
              statusCode: 404,
              body: {
                message: _i18n.i18n.translate('xpack.remoteClusters.deleteRemoteCluster.noRemoteClusterErrorMessage', {
                  defaultMessage: 'There is no remote cluster with that name.'
                })
              }
            });
          }
        } catch (error) {
          return response.customError({
            statusCode: 400,
            body: error
          });
        }
      }; // Send the request to delete the cluster and return an error if it could not be deleted.


      const sendRequestToDeleteCluster = async (name, hasDeprecatedProxySetting) => {
        try {
          const body = (0, _lib.serializeCluster)({
            name,
            hasDeprecatedProxySetting
          });
          const updateClusterResponse = await callAsCurrentUser('cluster.putSettings', {
            body
          });
          const acknowledged = (0, _lodash.get)(updateClusterResponse, 'acknowledged');
          const cluster = (0, _lodash.get)(updateClusterResponse, `persistent.cluster.remote.${name}`); // Deletion was successful

          if (acknowledged && !cluster) {
            return null;
          } // If for some reason the ES response still returns the cluster information,
          // return an error. This shouldn't happen.


          return response.customError({
            statusCode: 400,
            body: {
              message: _i18n.i18n.translate('xpack.remoteClusters.deleteRemoteCluster.unknownRemoteClusterErrorMessage', {
                defaultMessage: 'Unable to delete cluster, information still returned from ES.'
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

      const deleteCluster = async clusterName => {
        // Validate that the cluster exists.
        let error = await validateClusterDoesExist(clusterName);

        if (!error) {
          // Check if cluster contains deprecated proxy setting
          const hasDeprecatedProxySetting = Boolean((0, _lodash.get)(clusterSettings, `persistent.cluster.remote[${clusterName}].proxy`, undefined)); // Delete the cluster.

          error = await sendRequestToDeleteCluster(clusterName, hasDeprecatedProxySetting);
        }

        if (error) {
          errors.push({
            name: clusterName,
            error
          });
        } else {
          itemsDeleted.push(clusterName);
        }
      }; // Delete all our cluster in parallel.


      await Promise.all(names.map(deleteCluster));
      return response.ok({
        body: {
          itemsDeleted,
          errors
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

  deps.router.delete({
    path: `${_constants.API_BASE_PATH}/{nameOrNames}`,
    validate: {
      params: paramsValidation
    }
  }, (0, _license_pre_routing_factory.licensePreRoutingFactory)(deps, deleteHandler));
};

exports.register = register;