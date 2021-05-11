"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.type = exports.ruleActionsSavedObjectMappings = exports.ruleActionsSavedObjectType = void 0;

var _migrations = require("./migrations");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const ruleActionsSavedObjectType = 'siem-detection-engine-rule-actions';
exports.ruleActionsSavedObjectType = ruleActionsSavedObjectType;
const ruleActionsSavedObjectMappings = {
  properties: {
    alertThrottle: {
      type: 'keyword'
    },
    ruleAlertId: {
      type: 'keyword'
    },
    ruleThrottle: {
      type: 'keyword'
    },
    actions: {
      properties: {
        group: {
          type: 'keyword'
        },
        id: {
          type: 'keyword'
        },
        action_type_id: {
          type: 'keyword'
        },
        params: {
          type: 'object',
          enabled: false
        }
      }
    }
  }
};
exports.ruleActionsSavedObjectMappings = ruleActionsSavedObjectMappings;
const type = {
  name: ruleActionsSavedObjectType,
  hidden: false,
  namespaceType: 'single',
  mappings: ruleActionsSavedObjectMappings,
  migrations: _migrations.ruleActionsSavedObjectMigration
};
exports.type = type;