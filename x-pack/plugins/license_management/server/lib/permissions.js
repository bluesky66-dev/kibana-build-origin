"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getPermissions = getPermissions;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

async function getPermissions({
  isSecurityEnabled,
  callAsCurrentUser
}) {
  if (!isSecurityEnabled) {
    // If security isn't enabled, let the user use license management
    return {
      hasPermission: true
    };
  }

  const options = {
    method: 'POST',
    path: '/_security/user/_has_privileges',
    body: {
      cluster: ['manage'] // License management requires "manage" cluster privileges

    }
  };

  try {
    const response = await callAsCurrentUser('transport.request', options);
    return {
      hasPermission: response.cluster.manage
    };
  } catch (error) {
    return error.body;
  }
}