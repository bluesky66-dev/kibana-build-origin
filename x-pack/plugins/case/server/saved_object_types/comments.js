"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.caseCommentSavedObjectType = exports.CASE_COMMENT_SAVED_OBJECT = void 0;

var _migrations = require("./migrations");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const CASE_COMMENT_SAVED_OBJECT = 'cases-comments';
exports.CASE_COMMENT_SAVED_OBJECT = CASE_COMMENT_SAVED_OBJECT;
const caseCommentSavedObjectType = {
  name: CASE_COMMENT_SAVED_OBJECT,
  hidden: false,
  namespaceType: 'single',
  mappings: {
    properties: {
      associationType: {
        type: 'keyword'
      },
      comment: {
        type: 'text'
      },
      type: {
        type: 'keyword'
      },
      alertId: {
        type: 'keyword'
      },
      index: {
        type: 'keyword'
      },
      created_at: {
        type: 'date'
      },
      created_by: {
        properties: {
          full_name: {
            type: 'keyword'
          },
          username: {
            type: 'keyword'
          },
          email: {
            type: 'keyword'
          }
        }
      },
      pushed_at: {
        type: 'date'
      },
      pushed_by: {
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
      rule: {
        properties: {
          id: {
            type: 'keyword'
          },
          name: {
            type: 'keyword'
          }
        }
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
  },
  migrations: _migrations.commentsMigrations
};
exports.caseCommentSavedObjectType = caseCommentSavedObjectType;