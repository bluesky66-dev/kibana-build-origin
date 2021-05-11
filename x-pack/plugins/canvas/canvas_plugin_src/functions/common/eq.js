"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.eq = eq;

var _i18n = require("../../../i18n");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function eq() {
  const {
    help,
    args: argHelp
  } = (0, _i18n.getFunctionHelp)().eq;
  return {
    name: 'eq',
    type: 'boolean',
    inputTypes: ['boolean', 'number', 'string', 'null'],
    help,
    args: {
      value: {
        aliases: ['_'],
        types: ['boolean', 'number', 'string', 'null'],
        required: true,
        help: argHelp.value
      }
    },
    fn: (input, args) => {
      return input === args.value;
    }
  };
}