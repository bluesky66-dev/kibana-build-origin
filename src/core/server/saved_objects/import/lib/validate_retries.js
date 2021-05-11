"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateRetries = void 0;

var _get_non_unique_entries = require("./get_non_unique_entries");

var _errors = require("../errors");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const validateRetries = retries => {
  const nonUniqueRetryObjects = (0, _get_non_unique_entries.getNonUniqueEntries)(retries);

  if (nonUniqueRetryObjects.length > 0) {
    throw _errors.SavedObjectsImportError.nonUniqueRetryObjects(nonUniqueRetryObjects);
  }

  const destinationEntries = retries.filter(retry => retry.destinationId !== undefined).map(({
    type,
    destinationId
  }) => ({
    type,
    id: destinationId
  }));
  const nonUniqueRetryDestinations = (0, _get_non_unique_entries.getNonUniqueEntries)(destinationEntries);

  if (nonUniqueRetryDestinations.length > 0) {
    throw _errors.SavedObjectsImportError.nonUniqueRetryDestinations(nonUniqueRetryDestinations);
  }
};

exports.validateRetries = validateRetries;