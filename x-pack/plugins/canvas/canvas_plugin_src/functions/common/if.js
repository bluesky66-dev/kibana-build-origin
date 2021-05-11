"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ifFn = ifFn;

var _i18n = require("../../../i18n");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function ifFn() {
  const {
    help,
    args: argHelp
  } = (0, _i18n.getFunctionHelp)().if;
  return {
    name: 'if',
    help,
    args: {
      condition: {
        types: ['boolean'],
        aliases: ['_'],
        help: argHelp.condition,
        required: true
      },
      then: {
        resolve: false,
        help: argHelp.then
      },
      else: {
        resolve: false,
        help: argHelp.else
      }
    },
    fn: async (input, args) => {
      if (args.condition) {
        if (typeof args.then === 'undefined') {
          return input;
        }

        return await args.then();
      } else {
        if (typeof args.else === 'undefined') {
          return input;
        }

        return await args.else();
      }
    }
  };
}