"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.lt = lt;

var _i18n = require("../../../i18n");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function lt() {
  const {
    help,
    args: argHelp
  } = (0, _i18n.getFunctionHelp)().lt;
  return {
    name: 'lt',
    type: 'boolean',
    inputTypes: ['number', 'string'],
    help,
    args: {
      value: {
        aliases: ['_'],
        types: ['number', 'string'],
        required: true,
        help: argHelp.value
      }
    },
    fn: (input, args) => {
      const {
        value
      } = args;

      if (typeof input !== typeof value) {
        return false;
      }

      return input < value;
    }
  };
}