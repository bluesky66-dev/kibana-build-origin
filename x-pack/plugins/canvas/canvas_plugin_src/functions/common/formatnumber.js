"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.formatnumber = formatnumber;

var _numeral = _interopRequireDefault(require("@elastic/numeral"));

var _i18n = require("../../../i18n");

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function formatnumber() {
  const {
    help,
    args: argHelp
  } = (0, _i18n.getFunctionHelp)().formatnumber;
  return {
    name: 'formatnumber',
    type: 'string',
    help,
    inputTypes: ['number'],
    args: {
      format: {
        aliases: ['_'],
        types: ['string'],
        help: argHelp.format,
        required: true
      }
    },
    fn: (input, args) => {
      if (!args.format) {
        return String(input);
      }

      return (0, _numeral.default)(input).format(args.format);
    }
  };
}