"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.switchFn = switchFn;

var _i18n = require("../../../i18n");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function switchFn() {
  const {
    help,
    args: argHelp
  } = (0, _i18n.getFunctionHelp)().switch;
  return {
    name: 'switch',
    help,
    args: {
      case: {
        types: ['case'],
        aliases: ['_'],
        resolve: false,
        multi: true,
        required: true,
        help: argHelp.case
      },
      default: {
        aliases: ['finally'],
        resolve: false,
        help: argHelp.default
      }
    },
    fn: async (input, args) => {
      const cases = args.case || [];

      for (let i = 0; i < cases.length; i++) {
        const {
          matches,
          result
        } = await cases[i]();

        if (matches) {
          return result;
        }
      }

      if (typeof args.default !== 'undefined') {
        return await args.default();
      }

      return input;
    }
  };
}