"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.string = string;

var _i18n = require("../../../i18n");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function string() {
  const {
    help,
    args: argHelp
  } = (0, _i18n.getFunctionHelp)().string;
  return {
    name: 'string',
    inputTypes: ['null'],
    aliases: [],
    type: 'string',
    help,
    args: {
      value: {
        aliases: ['_'],
        types: ['string', 'number', 'boolean'],
        multi: true,
        help: argHelp.value
      }
    },
    fn: (input, args) => args.value.join('')
  };
}