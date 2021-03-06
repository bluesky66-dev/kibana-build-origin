"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.subCaseSavedObjectType = exports.SUB_CASE_SAVED_OBJECT = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const SUB_CASE_SAVED_OBJECT = 'cases-sub-case';
exports.SUB_CASE_SAVED_OBJECT = SUB_CASE_SAVED_OBJECT;
const subCaseSavedObjectType = {
  name: SUB_CASE_SAVED_OBJECT,
  hidden: false,
  namespaceType: 'single',
  mappings: {
    properties: {
      closed_at: {
        type: 'date'
      },
      closed_by: {
        properties: {
          username: {
            type: 'keyword'
          },
          full_name: {
            type: 'keyword'
          },
          email: {
            type: 'keyword'
          }
        }
      },
      created_at: {
        type: 'date'
      },
      created_by: {
        properties: {
          username: {
            type: 'keyword'
          },
          full_name: {
            type: 'keyword'
          },
          email: {
            type: 'keyword'
          }
        }
      },
      status: {
        type: 'keyword'
      },
      updated_at: {
        type: 'date'
      },
      updated_by: {
        properties: {
          username: {
            type: 'keyword'
          },
          full_name: {
            type: 'keyword'
          },
          email: {
            type: 'keyword'
          }
        }
      }
    }
  }
};
exports.subCaseSavedObjectType = subCaseSavedObjectType;