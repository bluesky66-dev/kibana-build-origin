"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.rounddate = rounddate;

var _moment = _interopRequireDefault(require("moment"));

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


function rounddate() {
  const {
    help,
    args: argHelp
  } = (0, _i18n.getFunctionHelp)().rounddate;
  return {
    name: 'rounddate',
    type: 'number',
    help,
    inputTypes: ['number'],
    args: {
      format: {
        aliases: ['_'],
        types: ['string'],
        help: argHelp.format
      }
    },
    fn: (input, args) => {
      if (!args.format) {
        return input;
      }

      return _moment.default.utc(_moment.default.utc(input).format(args.format), args.format).valueOf();
    }
  };
}