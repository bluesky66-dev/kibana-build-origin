"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.date = date;

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


function date() {
  const {
    help,
    args: argHelp
  } = (0, _i18n.getFunctionHelp)().date;
  const errors = (0, _i18n.getFunctionErrors)().date;
  return {
    name: 'date',
    type: 'number',
    help,
    inputTypes: ['null'],
    args: {
      value: {
        aliases: ['_'],
        types: ['string'],
        help: argHelp.value
      },
      format: {
        types: ['string'],
        help: argHelp.format
      }
    },
    fn: (input, args) => {
      const {
        value: argDate,
        format
      } = args;
      const outputDate = argDate && format ? _moment.default.utc(argDate, format).toDate() : argDate ? new Date(argDate) : new Date();

      if (isNaN(outputDate.getTime())) {
        throw errors.invalidDateInput(argDate);
      }

      return outputDate.valueOf();
    }
  };
}