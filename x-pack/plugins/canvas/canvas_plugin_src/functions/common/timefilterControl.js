"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.timefilterControl = timefilterControl;

var _i18n = require("../../../i18n");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function timefilterControl() {
  const {
    help,
    args: argHelp
  } = (0, _i18n.getFunctionHelp)().timefilterControl;
  return {
    name: 'timefilterControl',
    aliases: [],
    type: 'render',
    inputTypes: ['null'],
    help,
    args: {
      column: {
        types: ['string'],
        aliases: ['field', 'c'],
        help: argHelp.column,
        default: '@timestamp'
      },
      // TODO: remove this deprecated arg
      compact: {
        types: ['boolean'],
        help: argHelp.compact,
        default: true,
        options: [true, false]
      },
      filterGroup: {
        types: ['string'],
        help: argHelp.filterGroup
      }
    },
    fn: (input, args) => {
      return {
        type: 'render',
        as: 'time_filter',
        value: args
      };
    }
  };
}