"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.type = exports.ruleStatusSavedObjectMappings = exports.ruleStatusSavedObjectType = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const ruleStatusSavedObjectType = 'siem-detection-engine-rule-status';
exports.ruleStatusSavedObjectType = ruleStatusSavedObjectType;
const ruleStatusSavedObjectMappings = {
  properties: {
    alertId: {
      type: 'keyword'
    },
    status: {
      type: 'keyword'
    },
    statusDate: {
      type: 'date'
    },
    lastFailureAt: {
      type: 'date'
    },
    lastSuccessAt: {
      type: 'date'
    },
    lastFailureMessage: {
      type: 'text'
    },
    lastSuccessMessage: {
      type: 'text'
    },
    lastLookBackDate: {
      type: 'date'
    },
    gap: {
      type: 'text'
    },
    bulkCreateTimeDurations: {
      type: 'float'
    },
    searchAfterTimeDurations: {
      type: 'float'
    }
  }
};
exports.ruleStatusSavedObjectMappings = ruleStatusSavedObjectMappings;
const type = {
  name: ruleStatusSavedObjectType,
  hidden: false,
  namespaceType: 'single',
  mappings: ruleStatusSavedObjectMappings
};
exports.type = type;