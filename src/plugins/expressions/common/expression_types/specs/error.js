"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.error = exports.isExpressionValueError = void 0;

var _get_type = require("../get_type");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const name = 'error';

const isExpressionValueError = value => (0, _get_type.getType)(value) === 'error';
/**
 * @deprecated
 *
 * Exported for backwards compatibility.
 */


exports.isExpressionValueError = isExpressionValueError;
const error = {
  name,
  to: {
    render: input => {
      return {
        type: 'render',
        as: name,
        value: {
          error: input.error,
          info: input.info
        }
      };
    }
  }
};
exports.error = error;