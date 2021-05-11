"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createAPIKey = createAPIKey;
exports.authenticate = authenticate;
exports.invalidateAPIKeys = invalidateAPIKeys;

var _server = require("../../../../../../src/core/server");

var _errors = require("../../errors");

var _app_context = require("../app_context");

var _output = require("../output");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function createAPIKey(soClient, name, roleDescriptors) {
  const adminUser = await _output.outputService.getAdminUser(soClient);

  if (!adminUser) {
    throw new Error('No admin user configured');
  }

  const request = _server.KibanaRequest.from({
    path: '/',
    route: {
      settings: {}
    },
    url: {
      href: '/'
    },
    raw: {
      req: {
        url: '/'
      }
    },
    headers: {
      authorization: `Basic ${Buffer.from(`${adminUser.username}:${adminUser.password}`).toString('base64')}`
    }
  });

  const security = _app_context.appContextService.getSecurity();

  if (!security) {
    throw new Error('Missing security plugin');
  }

  try {
    const key = await security.authc.apiKeys.create(request, {
      name,
      role_descriptors: roleDescriptors
    });
    return key;
  } catch (err) {
    if ((0, _errors.isESClientError)(err) && err.statusCode === 401) {
      // Clear Fleet admin user cache as the user is probably not valid anymore
      _output.outputService.invalidateCache();

      throw new _errors.FleetAdminUserInvalidError(`Fleet Admin user is invalid: ${err.message}`);
    }

    throw err;
  }
}

async function authenticate(callCluster) {
  try {
    await callCluster('transport.request', {
      path: '/_security/_authenticate',
      method: 'GET'
    });
  } catch (e) {
    throw new Error('ApiKey is not valid: impossible to authenticate user');
  }
}

async function invalidateAPIKeys(soClient, ids) {
  const adminUser = await _output.outputService.getAdminUser(soClient);

  if (!adminUser) {
    throw new Error('No admin user configured');
  }

  const request = _server.KibanaRequest.from({
    path: '/',
    route: {
      settings: {}
    },
    url: {
      href: '/'
    },
    raw: {
      req: {
        url: '/'
      }
    },
    headers: {
      authorization: `Basic ${Buffer.from(`${adminUser.username}:${adminUser.password}`).toString('base64')}`
    }
  });

  const security = _app_context.appContextService.getSecurity();

  if (!security) {
    throw new Error('Missing security plugin');
  }

  try {
    const res = await security.authc.apiKeys.invalidate(request, {
      ids
    });
    return res;
  } catch (err) {
    if ((0, _errors.isESClientError)(err) && err.statusCode === 401) {
      // Clear Fleet admin user cache as the user is probably not valid anymore
      _output.outputService.invalidateCache();

      throw new _errors.FleetAdminUserInvalidError(`Fleet Admin user is invalid: ${err.message}`);
    }

    throw err;
  }
}