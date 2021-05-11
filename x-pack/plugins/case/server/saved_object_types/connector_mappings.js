"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.caseConnectorMappingsSavedObjectType = exports.CASE_CONNECTOR_MAPPINGS_SAVED_OBJECT = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const CASE_CONNECTOR_MAPPINGS_SAVED_OBJECT = 'cases-connector-mappings';
exports.CASE_CONNECTOR_MAPPINGS_SAVED_OBJECT = CASE_CONNECTOR_MAPPINGS_SAVED_OBJECT;
const caseConnectorMappingsSavedObjectType = {
  name: CASE_CONNECTOR_MAPPINGS_SAVED_OBJECT,
  hidden: false,
  namespaceType: 'single',
  mappings: {
    properties: {
      mappings: {
        properties: {
          source: {
            type: 'keyword'
          },
          target: {
            type: 'keyword'
          },
          action_type: {
            type: 'keyword'
          }
        }
      }
    }
  }
};
exports.caseConnectorMappingsSavedObjectType = caseConnectorMappingsSavedObjectType;