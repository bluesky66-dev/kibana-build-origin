"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.caseUserActionSavedObjectType = exports.CASE_USER_ACTION_SAVED_OBJECT = void 0;

var _migrations = require("./migrations");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const CASE_USER_ACTION_SAVED_OBJECT = 'cases-user-actions';
exports.CASE_USER_ACTION_SAVED_OBJECT = CASE_USER_ACTION_SAVED_OBJECT;
const caseUserActionSavedObjectType = {
  name: CASE_USER_ACTION_SAVED_OBJECT,
  hidden: false,
  namespaceType: 'single',
  mappings: {
    properties: {
      action_field: {
        type: 'keyword'
      },
      action: {
        type: 'keyword'
      },
      action_at: {
        type: 'date'
      },
      action_by: {
        properties: {
          email: {
            type: 'keyword'
          },
          username: {
            type: 'keyword'
          },
          full_name: {
            type: 'keyword'
          }
        }
      },
      new_value: {
        type: 'text'
      },
      old_value: {
        type: 'text'
      }
    }
  },
  migrations: _migrations.userActionsMigrations
};
exports.caseUserActionSavedObjectType = caseUserActionSavedObjectType;