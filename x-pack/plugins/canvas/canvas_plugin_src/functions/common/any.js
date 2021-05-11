"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.any = any;

var _i18n = require("../../../i18n");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function any() {
  const {
    help,
    args: argHelp
  } = (0, _i18n.getFunctionHelp)().any;
  return {
    name: 'any',
    type: 'boolean',
    inputTypes: ['null'],
    help,
    args: {
      condition: {
        aliases: ['_'],
        types: ['boolean'],
        required: true,
        multi: true,
        help: argHelp.condition
      }
    },
    fn: (input, args) => {
      const conditions = args.condition || [];
      return conditions.some(Boolean);
    }
  };
}