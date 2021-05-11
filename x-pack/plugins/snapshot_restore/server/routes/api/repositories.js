"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerRepositoriesRoutes = registerRepositoriesRoutes;

var _constants = require("../../../common/constants");

var _helpers = require("../helpers");

var _validate_schemas = require("./validate_schemas");

var _lib = require("../../lib");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function registerRepositoriesRoutes({
  router,
  license,
  config: {
    isCloudEnabled
  },
  lib: {
    isEsError,
    wrapEsError
  }
}) {
  // GET all repositories
  router.get({
    path: (0, _helpers.addBasePath)('repositories'),
    validate: false
  }, license.guardApiRoute(async (ctx, req, res) => {
    const {
      callAsCurrentUser
    } = ctx.snapshotRestore.client;
    const managedRepositoryName = await (0, _lib.getManagedRepositoryName)(callAsCurrentUser);
    let repositoryNames;
    let repositories;
    let managedRepository;

    try {
      const repositoriesByName = await callAsCurrentUser('snapshot.getRepository', {
        repository: '_all'
      });
      repositoryNames = Object.keys(repositoriesByName);
      repositories = repositoryNames.map(name => {
        const {
          type = '',
          settings = {}
        } = repositoriesByName[name];
        return {
          name,
          type,
          settings: (0, _lib.deserializeRepositorySettings)(settings)
        };
      });
      managedRepository = {
        name: managedRepositoryName
      };
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
    } // If a managed repository, we also need to check if a policy is associated to it


    if (managedRepositoryName) {
      try {
        const policiesByName = await callAsCurrentUser('sr.policies', {
          human: true
        });
        const managedRepositoryPolicy = Object.entries(policiesByName).filter(([, data]) => {
          const {
            policy
          } = data;
          return policy.repository === managedRepositoryName;
        }).flat();
        const [policyName] = managedRepositoryPolicy;
        managedRepository.policy = policyName;
      } catch (e) {// swallow error for now
        // we don't want to block repositories from loading if request fails
      }
    }

    return res.ok({
      body: {
        repositories,
        managedRepository
      }
    });
  })); // GET one repository

  router.get({
    path: (0, _helpers.addBasePath)('repositories/{name}'),
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
    const managedRepository = await (0, _lib.getManagedRepositoryName)(callAsCurrentUser);
    let repositoryByName;

    try {
      repositoryByName = await callAsCurrentUser('snapshot.getRepository', {
        repository: name
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

    const {
      snapshots
    } = await callAsCurrentUser('snapshot.get', {
      repository: name,
      snapshot: '_all'
    }).catch(e => ({
      snapshots: null
    }));

    if (repositoryByName[name]) {
      const {
        type = '',
        settings = {}
      } = repositoryByName[name];
      return res.ok({
        body: {
          repository: {
            name,
            type,
            settings: (0, _lib.deserializeRepositorySettings)(settings)
          },
          isManagedRepository: managedRepository === name,
          snapshots: {
            count: snapshots ? snapshots.length : null
          }
        }
      });
    }

    return res.ok({
      body: {
        repository: {},
        snapshots: {}
      }
    });
  })); // GET repository types

  router.get({
    path: (0, _helpers.addBasePath)('repository_types'),
    validate: false
  }, license.guardApiRoute(async (ctx, req, res) => {
    const {
      callAsCurrentUser
    } = ctx.snapshotRestore.client; // In ECE/ESS, do not enable the default types

    const types = isCloudEnabled ? [] : [..._constants.DEFAULT_REPOSITORY_TYPES];

    try {
      // Call with internal user so that the requesting user does not need `monitoring` cluster
      // privilege just to see list of available repository types
      const plugins = await callAsCurrentUser('cat.plugins', {
        format: 'json'
      }); // Filter list of plugins to repository-related ones

      if (plugins && plugins.length) {
        const pluginNames = [...new Set(plugins.map(plugin => plugin.component))];
        pluginNames.forEach(pluginName => {
          if (_constants.REPOSITORY_PLUGINS_MAP[pluginName]) {
            types.push(_constants.REPOSITORY_PLUGINS_MAP[pluginName]);
          }
        });
      }

      return res.ok({
        body: types
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
  })); // Verify repository

  router.get({
    path: (0, _helpers.addBasePath)('repositories/{name}/verify'),
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
      const verificationResults = await callAsCurrentUser('snapshot.verifyRepository', {
        repository: name
      }).catch(e => ({
        valid: false,
        error: e.response ? JSON.parse(e.response) : e
      }));
      return res.ok({
        body: {
          verification: verificationResults.error ? verificationResults : {
            valid: true,
            response: verificationResults
          }
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
  })); // Cleanup repository

  router.post({
    path: (0, _helpers.addBasePath)('repositories/{name}/cleanup'),
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
      const cleanupResults = await callAsCurrentUser('sr.cleanupRepository', {
        name
      }).catch(e => ({
        cleaned: false,
        error: e.response ? JSON.parse(e.response) : e
      }));
      return res.ok({
        body: {
          cleanup: cleanupResults.error ? cleanupResults : {
            cleaned: true,
            response: cleanupResults
          }
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
  })); // Create repository

  router.put({
    path: (0, _helpers.addBasePath)('repositories'),
    validate: {
      body: _validate_schemas.repositorySchema
    }
  }, license.guardApiRoute(async (ctx, req, res) => {
    const {
      callAsCurrentUser
    } = ctx.snapshotRestore.client;
    const {
      name = '',
      type = '',
      settings = {}
    } = req.body; // Check that repository with the same name doesn't already exist

    try {
      const repositoryByName = await callAsCurrentUser('snapshot.getRepository', {
        repository: name
      });

      if (repositoryByName[name]) {
        return res.conflict({
          body: 'There is already a repository with that name.'
        });
      }
    } catch (e) {// Silently swallow errors
    } // Otherwise create new repository


    try {
      const response = await callAsCurrentUser('snapshot.createRepository', {
        repository: name,
        body: {
          type,
          settings: (0, _lib.serializeRepositorySettings)(settings)
        },
        verify: false
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
  })); // Update repository

  router.put({
    path: (0, _helpers.addBasePath)('repositories/{name}'),
    validate: {
      body: _validate_schemas.repositorySchema,
      params: _validate_schemas.nameParameterSchema
    }
  }, license.guardApiRoute(async (ctx, req, res) => {
    const {
      callAsCurrentUser
    } = ctx.snapshotRestore.client;
    const {
      name
    } = req.params;
    const {
      type = '',
      settings = {}
    } = req.body;

    try {
      // Check that repository with the given name exists
      // If it doesn't exist, 404 will be thrown by ES and will be returned
      await callAsCurrentUser('snapshot.getRepository', {
        repository: name
      }); // Otherwise update repository

      const response = await callAsCurrentUser('snapshot.createRepository', {
        repository: name,
        body: {
          type,
          settings: (0, _lib.serializeRepositorySettings)(settings)
        },
        verify: false
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
  })); // Delete repository

  router.delete({
    path: (0, _helpers.addBasePath)('repositories/{name}'),
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
    const repositoryNames = name.split(',');
    const response = {
      itemsDeleted: [],
      errors: []
    };

    try {
      await Promise.all(repositoryNames.map(repoName => {
        return callAsCurrentUser('snapshot.deleteRepository', {
          repository: repoName
        }).then(() => response.itemsDeleted.push(repoName)).catch(e => response.errors.push({
          name: repoName,
          error: wrapEsError(e)
        }));
      }));
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
  }));
}