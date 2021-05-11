"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.formatdate = formatdate;

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


function formatdate() {
  const {
    help,
    args: argHelp
  } = (0, _i18n.getFunctionHelp)().formatdate;
  return {
    name: 'formatdate',
    type: 'string',
    inputTypes: ['number', 'string'],
    help,
    args: {
      format: {
        aliases: ['_'],
        types: ['string'],
        required: true,
        help: argHelp.format
      }
    },
    fn: (input, args) => {
      if (!args.format) {
        return _moment.default.utc(new Date(input)).toISOString();
      }

      return _moment.default.utc(new Date(input)).format(args.format);
    }
  };
}