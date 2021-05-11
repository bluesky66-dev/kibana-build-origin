"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.doFn = doFn;

var _i18n = require("../../../i18n");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function doFn() {
  const {
    help,
    args: argHelp
  } = (0, _i18n.getFunctionHelp)().do;
  return {
    name: 'do',
    help,
    args: {
      fn: {
        aliases: ['_', 'exp', 'expression', 'function'],
        multi: true,
        help: argHelp.fn
      }
    },
    fn: context => context
  };
}