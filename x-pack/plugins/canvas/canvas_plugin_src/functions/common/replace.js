"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.replace = replace;

var _i18n = require("../../../i18n");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function replace() {
  const {
    help,
    args: argHelp
  } = (0, _i18n.getFunctionHelp)().replace;
  return {
    name: 'replace',
    type: 'string',
    help,
    inputTypes: ['string'],
    args: {
      pattern: {
        aliases: ['_', 'regex'],
        types: ['string'],
        help: argHelp.pattern
      },
      flags: {
        aliases: ['modifiers'],
        types: ['string'],
        help: argHelp.flags,
        default: 'g'
      },
      replacement: {
        types: ['string'],
        help: argHelp.replacement,
        default: '""'
      }
    },
    fn: (input, args) => input.replace(new RegExp(args.pattern, args.flags), args.replacement)
  };
}