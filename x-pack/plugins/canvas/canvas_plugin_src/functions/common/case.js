"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.caseFn = caseFn;

var _i18n = require("../../../i18n");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function caseFn() {
  const {
    help,
    args: argHelp
  } = (0, _i18n.getFunctionHelp)().case;
  return {
    name: 'case',
    type: 'case',
    help,
    args: {
      when: {
        aliases: ['_'],
        resolve: false,
        help: argHelp.when
      },
      if: {
        types: ['boolean'],
        help: argHelp.if
      },
      then: {
        resolve: false,
        required: true,
        help: argHelp.then
      }
    },
    fn: async (input, args) => {
      const matches = await doesMatch(input, args);
      const result = matches ? await getResult(input, args) : null;
      return {
        type: 'case',
        matches,
        result
      };
    }
  };
}

async function doesMatch(context, args) {
  if (typeof args.if !== 'undefined') {
    return args.if;
  }

  if (typeof args.when !== 'undefined') {
    return (await args.when()) === context;
  }

  return true;
}

async function getResult(context, args) {
  if (typeof args.then !== 'undefined') {
    return await args.then();
  }

  return context;
}