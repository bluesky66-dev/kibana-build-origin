"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getPolicyExists = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getPolicyExists = async (callWithRequest, policy) => {
  try {
    await callWithRequest('transport.request', {
      path: `/_ilm/policy/${policy}`,
      method: 'GET'
    }); // Return true that there exists a policy which is not 404 or some error
    // Since there is not a policy exists API, this is how we create one by calling
    // into the API to get it if it exists or rely on it to throw a 404

    return true;
  } catch (err) {
    if (err.statusCode === 404) {
      return false;
    } else {
      throw err;
    }
  }
};

exports.getPolicyExists = getPolicyExists;