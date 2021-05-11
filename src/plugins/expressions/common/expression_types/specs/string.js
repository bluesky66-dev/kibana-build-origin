"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.string = void 0;

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const name = 'string';
const string = {
  name,
  from: {
    null: () => '',
    boolean: b => String(b),
    number: n => String(n)
  },
  to: {
    render: text => {
      return {
        type: 'render',
        as: 'text',
        value: {
          text
        }
      };
    },
    datatable: value => ({
      type: 'datatable',
      columns: [{
        id: 'value',
        name: 'value',
        meta: {
          type: 'string'
        }
      }],
      rows: [{
        value
      }]
    })
  }
};
exports.string = string;