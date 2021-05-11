"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.boolean = void 0;

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const name = 'boolean';
const boolean = {
  name,
  from: {
    null: () => false,
    number: n => Boolean(n),
    string: s => Boolean(s)
  },
  to: {
    render: value => {
      const text = `${value}`;
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
          type: name
        }
      }],
      rows: [{
        value
      }]
    })
  }
};
exports.boolean = boolean;