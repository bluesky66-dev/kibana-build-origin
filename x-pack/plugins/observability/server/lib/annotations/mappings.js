"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mappings = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const mappings = {
  dynamic: 'strict',
  properties: {
    annotation: {
      properties: {
        type: {
          type: 'keyword'
        }
      }
    },
    message: {
      type: 'text'
    },
    tags: {
      type: 'keyword'
    },
    '@timestamp': {
      type: 'date'
    },
    event: {
      properties: {
        created: {
          type: 'date'
        }
      }
    },
    service: {
      properties: {
        name: {
          type: 'keyword'
        },
        environment: {
          type: 'keyword'
        },
        version: {
          type: 'keyword'
        }
      }
    }
  }
};
exports.mappings = mappings;