"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.partiallyUpdateAlert = partiallyUpdateAlert;

var _lodash = require("lodash");

var _server = require("../../../../../src/core/server");

var _index = require("./index");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// direct, partial update to an alert saved object via scoped SavedObjectsClient
// using namespace set in the client


async function partiallyUpdateAlert(savedObjectsClient, id, attributes, options = {}) {
  // ensure we only have the valid attributes excluded from AAD
  const attributeUpdates = (0, _lodash.pick)(attributes, _index.AlertAttributesExcludedFromAAD);
  const updateOptions = (0, _lodash.pick)(options, 'namespace', 'version', 'refresh');

  try {
    await savedObjectsClient.update('alert', id, attributeUpdates, updateOptions);
  } catch (err) {
    if (options !== null && options !== void 0 && options.ignore404 && _server.SavedObjectsErrorHelpers.isNotFoundError(err)) {
      return;
    }

    throw err;
  }
}