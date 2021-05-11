"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ensureDeprecatedFieldsAreCorrected = ensureDeprecatedFieldsAreCorrected;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function ensureDeprecatedFieldsAreCorrected({
  id,
  taskType,
  interval,
  schedule,
  ...taskInstance
}, logger) {
  if (interval) {
    logger.warn(`Task${id ? ` "${id}"` : ''} of type "${taskType}" has been scheduled with the deprecated 'interval' field which is due to be removed in a future release`);
  }

  return {
    id,
    taskType,
    ...taskInstance,
    schedule: schedule || (interval ? {
      interval
    } : undefined)
  };
}