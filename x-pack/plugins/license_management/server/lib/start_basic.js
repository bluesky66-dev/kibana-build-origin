"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.startBasic = startBasic;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getStartBasicPath = acknowledge => `/_license/start_basic${acknowledge ? '?acknowledge=true' : ''}`;

async function startBasic({
  acknowledge,
  callAsCurrentUser,
  licensing
}) {
  const options = {
    method: 'POST',
    path: getStartBasicPath(acknowledge)
  };

  try {
    const response = await callAsCurrentUser('transport.request', options);
    const {
      basic_was_started: basicWasStarted
    } = response;

    if (basicWasStarted) {
      await licensing.refresh();
    }

    return response;
  } catch (error) {
    return error.body;
  }
}