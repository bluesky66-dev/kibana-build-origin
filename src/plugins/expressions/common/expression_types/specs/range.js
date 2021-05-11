"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.range = void 0;

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const name = 'range';
const range = {
  name,
  from: {
    null: () => {
      return {
        type: 'range',
        from: 0,
        to: 0
      };
    }
  },
  to: {
    render: value => {
      const text = (value === null || value === void 0 ? void 0 : value.label) || `from ${value.from} to ${value.to}`;
      return {
        type: 'render',
        as: 'text',
        value: {
          text
        }
      };
    }
  }
};
exports.range = range;