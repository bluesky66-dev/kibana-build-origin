"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.putLicense = putLicense;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getLicensePath = acknowledge => `/_license${acknowledge ? '?acknowledge=true' : ''}`;

async function putLicense({
  acknowledge,
  callAsCurrentUser,
  licensing,
  license
}) {
  const options = {
    method: 'POST',
    path: getLicensePath(acknowledge),
    body: license
  };

  try {
    const response = await callAsCurrentUser('transport.request', options);
    const {
      acknowledged,
      license_status: licenseStatus
    } = response;

    if (acknowledged && licenseStatus === 'valid') {
      await licensing.refresh();
    }

    return response;
  } catch (error) {
    return error.body;
  }
}