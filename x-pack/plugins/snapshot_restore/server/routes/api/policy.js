"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerPolicyRoutes = registerPolicyRoutes;

var _configSchema = require("@kbn/config-schema");

var _lib = require("../../../common/lib");

var _lib2 = require("../../lib");

var _helpers = require("../helpers");

var _validate_schemas = require("./validate_schemas");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function registerPolicyRoutes({
  router,
  license,
  lib: {
    isEsError,
    wrapEsError
  }
}) {
  // GET all policies
  router.get({
    path: (0, _helpers.addBasePath)('policies'),
    validate: false
  }, license.guardApiRoute(async (ctx, req, res) => {
    const {
      callAsCurrentUser
    } = ctx.snapshotRestore.client;
    const managedPolicies = await (0, _lib2.getManagedPolicyNames)(callAsCurrentUser);

    try {
      // Get policies
      const policiesByName = await callAsCurrentUser('sr.policies', {
        human: true
      }); // Deserialize policies

      return res.ok({
        body: {
          policies: Object.entries(policiesByName).map(([name, policy]) => {
            return (0, _lib.deserializePolicy)(name, policy, managedPolicies);
          })
        }
      });
    } catch (e) {
      if (isEsError(e)) {
        return res.customError({
          statusCode: e.statusCode,
          body: e
        });
      } // Case: default


      return res.internalError({
        body: e
      });
    }
  })); // GET one policy

  router.get({
    path: (0, _helpers.addBasePath)('policy/{name}'),
    validate: {
      params: _validate_schemas.nameParameterSchema
    }
  }, license.guardApiRoute(async (ctx, req, res) => {
    const {
      callAsCurrentUser
    } = ctx.snapshotRestore.client;
    const {
      name
    } = req.params;

    try {
      const policiesByName = await callAsCurrentUser('sr.policy', {
        name,
        human: true
      });

      if (!policiesByName[name]) {
        // If policy doesn't exist, ES will return 200 with an empty object, so manually throw 404 here
        return res.notFound({
          body: 'Policy not found'
        });
      }

      const managedPolicies = await (0, _lib2.getManagedPolicyNames)(callAsCurrentUser); // Deserialize policy

      return res.ok({
        body: {
          policy: (0, _lib.deserializePolicy)(name, policiesByName[name], managedPolicies)
        }
      });
    } catch (e) {
      if (isEsError(e)) {
        return res.customError({
          statusCode: e.statusCode,
          body: e
        });
      } // Case: default


      return res.internalError({
        body: e
      });
    }
  })); // Create policy

  router.post({
    path: (0, _helpers.addBasePath)('policies'),
    validate: {
      body: _validate_schemas.policySchema
    }
  }, license.guardApiRoute(async (ctx, req, res) => {
    const {
      callAsCurrentUser
    } = ctx.snapshotRestore.client;
    const policy = req.body;
    const {
      name
    } = policy;

    try {
      // Check that policy with the same name doesn't already exist
      const policyByName = await callAsCurrentUser('sr.policy', {
        name
      });

      if (policyByName[name]) {
        return res.conflict({
          body: 'There is already a policy with that name.'
        });
      }
    } catch (e) {// Silently swallow errors
    }

    try {
      // Otherwise create new policy
      const response = await callAsCurrentUser('sr.updatePolicy', {
        name,
        body: (0, _lib.serializePolicy)(policy)
      });
      return res.ok({
        body: response
      });
    } catch (e) {
      if (isEsError(e)) {
        return res.customError({
          statusCode: e.statusCode,
          body: e
        });
      } // Case: default


      return res.internalError({
        body: e
      });
    }
  })); // Update policy

  router.put({
    path: (0, _helpers.addBasePath)('policies/{name}'),
    validate: {
      params: _validate_schemas.nameParameterSchema,
      body: _validate_schemas.policySchema
    }
  }, license.guardApiRoute(async (ctx, req, res) => {
    const {
      callAsCurrentUser
    } = ctx.snapshotRestore.client;
    const {
      name
    } = req.params;
    const policy = req.body;

    try {
      // Check that policy with the given name exists
      // If it doesn't exist, 404 will be thrown by ES and will be returned
      await callAsCurrentUser('sr.policy', {
        name
      }); // Otherwise update policy

      const response = await callAsCurrentUser('sr.updatePolicy', {
        name,
        body: (0, _lib.serializePolicy)(policy)
      });
      return res.ok({
        body: response
      });
    } catch (e) {
      if (isEsError(e)) {
        return res.customError({
          statusCode: e.statusCode,
          body: e
        });
      } // Case: default


      return res.internalError({
        body: e
      });
    }
  })); // Delete policy

  router.delete({
    path: (0, _helpers.addBasePath)('policies/{name}'),
    validate: {
      params: _validate_schemas.nameParameterSchema
    }
  }, license.guardApiRoute(async (ctx, req, res) => {
    const {
      callAsCurrentUser
    } = ctx.snapshotRestore.client;
    const {
      name
    } = req.params;
    const policyNames = name.split(',');
    const response = {
      itemsDeleted: [],
      errors: []
    };
    await Promise.all(policyNames.map(policyName => {
      return callAsCurrentUser('sr.deletePolicy', {
        name: policyName
      }).then(() => response.itemsDeleted.push(policyName)).catch(e => response.errors.push({
        name: policyName,
        error: wrapEsError(e)
      }));
    }));
    return res.ok({
      body: response
    });
  })); // Execute policy

  router.post({
    path: (0, _helpers.addBasePath)('policy/{name}/run'),
    validate: {
      params: _validate_schemas.nameParameterSchema
    }
  }, license.guardApiRoute(async (ctx, req, res) => {
    const {
      callAsCurrentUser
    } = ctx.snapshotRestore.client;
    const {
      name
    } = req.params;

    try {
      const {
        snapshot_name: snapshotName
      } = await callAsCurrentUser('sr.executePolicy', {
        name
      });
      return res.ok({
        body: {
          snapshotName
        }
      });
    } catch (e) {
      if (isEsError(e)) {
        return res.customError({
          statusCode: e.statusCode,
          body: e
        });
      } // Case: default


      return res.internalError({
        body: e
      });
    }
  })); // Get policy indices

  router.get({
    path: (0, _helpers.addBasePath)('policies/indices'),
    validate: false
  }, license.guardApiRoute(async (ctx, req, res) => {
    const {
      callAsCurrentUser
    } = ctx.snapshotRestore.client;

    try {
      const resolvedIndicesResponse = await callAsCurrentUser('transport.request', {
        method: 'GET',
        path: `/_resolve/index/*`,
        query: {
          expand_wildcards: 'all'
        }
      });
      const body = {
        dataStreams: resolvedIndicesResponse.data_streams.map(({
          name
        }) => name).sort(),
        indices: resolvedIndicesResponse.indices.flatMap(index => index.data_stream ? [] : index.name).sort()
      };
      return res.ok({
        body
      });
    } catch (e) {
      if (isEsError(e)) {
        return res.customError({
          statusCode: e.statusCode,
          body: e
        });
      } // Case: default


      return res.internalError({
        body: e
      });
    }
  })); // Get retention settings

  router.get({
    path: (0, _helpers.addBasePath)('policies/retention_settings'),
    validate: false
  }, license.guardApiRoute(async (ctx, req, res) => {
    const {
      callAsCurrentUser
    } = ctx.snapshotRestore.client;
    const {
      persistent,
      transient,
      defaults
    } = await callAsCurrentUser('cluster.getSettings', {
      filterPath: '**.slm.retention*',
      includeDefaults: true
    });
    const {
      slm: retentionSettings = undefined
    } = { ...defaults,
      ...persistent,
      ...transient
    };
    const {
      retention_schedule: retentionSchedule
    } = retentionSettings;
    return res.ok({
      body: {
        retentionSchedule
      }
    });
  })); // Update retention settings

  const retentionSettingsSchema = _configSchema.schema.object({
    retentionSchedule: _configSchema.schema.string()
  });

  router.put({
    path: (0, _helpers.addBasePath)('policies/retention_settings'),
    validate: {
      body: retentionSettingsSchema
    }
  }, license.guardApiRoute(async (ctx, req, res) => {
    const {
      callAsCurrentUser
    } = ctx.snapshotRestore.client;
    const {
      retentionSchedule
    } = req.body;

    try {
      const response = await callAsCurrentUser('cluster.putSettings', {
        body: {
          persistent: {
            slm: {
              retention_schedule: retentionSchedule
            }
          }
        }
      });
      return res.ok({
        body: response
      });
    } catch (e) {
      if (isEsError(e)) {
        return res.customError({
          statusCode: e.statusCode,
          body: e
        });
      } // Case: default


      return res.internalError({
        body: e
      });
    }
  })); // Execute retention

  router.post({
    path: (0, _helpers.addBasePath)('policies/retention'),
    validate: false
  }, license.guardApiRoute(async (ctx, req, res) => {
    const {
      callAsCurrentUser
    } = ctx.snapshotRestore.client;
    const response = await callAsCurrentUser('sr.executeRetention');
    return res.ok({
      body: response
    });
  }));
}