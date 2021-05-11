"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.all = all;

var _i18n = require("../../../i18n");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function all() {
  const {
    help,
    args: argHelp
  } = (0, _i18n.getFunctionHelp)().all;
  return {
    name: 'all',
    type: 'boolean',
    help,
    inputTypes: ['null'],
    args: {
      condition: {
        aliases: ['_'],
        types: ['boolean'],
        help: argHelp.condition,
        required: true,
        multi: true
      }
    },
    fn: (input, args) => {
      const conditions = args.condition || [];
      return conditions.every(Boolean);
    }
  };
}