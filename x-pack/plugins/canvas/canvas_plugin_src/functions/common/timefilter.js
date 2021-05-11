"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.timefilter = timefilter;

var _datemath = _interopRequireDefault(require("@elastic/datemath"));

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


function timefilter() {
  const {
    help,
    args: argHelp
  } = (0, _i18n.getFunctionHelp)().timefilter;
  const errors = (0, _i18n.getFunctionErrors)().timefilter;
  return {
    name: 'timefilter',
    aliases: [],
    type: 'filter',
    inputTypes: ['filter'],
    help,
    args: {
      column: {
        types: ['string'],
        aliases: ['field', 'c'],
        default: '@timestamp',
        help: argHelp.column
      },
      from: {
        types: ['string'],
        aliases: ['f', 'start'],
        help: argHelp.from
      },
      to: {
        types: ['string'],
        aliases: ['t', 'end'],
        help: argHelp.to
      },
      filterGroup: {
        types: ['string'],
        help: 'The group name for the filter'
      }
    },
    fn: (input, args) => {
      if (!args.from && !args.to) {
        return input;
      }

      const {
        from,
        to,
        column
      } = args;
      const filter = {
        type: 'filter',
        filterType: 'time',
        column,
        and: []
      };

      function parseAndValidate(str, {
        roundUp
      }) {
        const moment = _datemath.default.parse(str, {
          roundUp
        });

        if (!moment || !moment.isValid()) {
          throw errors.invalidString(str);
        }

        return moment.toISOString();
      }

      if (!!to) {
        filter.to = parseAndValidate(to, {
          roundUp: true
        });
      }

      if (!!from) {
        filter.from = parseAndValidate(from, {
          roundUp: false
        });
      }

      return { ...input,
        and: [...input.and, filter]
      };
    }
  };
}