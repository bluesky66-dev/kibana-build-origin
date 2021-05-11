"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.markApiKeyForInvalidation = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const markApiKeyForInvalidation = async ({
  apiKey
}, logger, savedObjectsClient) => {
  if (!apiKey) {
    return;
  }

  try {
    const apiKeyId = Buffer.from(apiKey, 'base64').toString().split(':')[0];
    await savedObjectsClient.create('api_key_pending_invalidation', {
      apiKeyId,
      createdAt: new Date().toISOString()
    });
  } catch (e) {
    logger.error(`Failed to mark for API key [id="${apiKey}"] for invalidation: ${e.message}`);
  }
};

exports.markApiKeyForInvalidation = markApiKeyForInvalidation;