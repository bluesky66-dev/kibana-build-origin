"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.compare = compare;
exports.Operation = void 0;

var _i18n = require("../../../i18n");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


let Operation;
exports.Operation = Operation;

(function (Operation) {
  Operation["EQ"] = "eq";
  Operation["GT"] = "gt";
  Operation["GTE"] = "gte";
  Operation["LT"] = "lt";
  Operation["LTE"] = "lte";
  Operation["NE"] = "ne";
  Operation["NEQ"] = "neq";
})(Operation || (exports.Operation = Operation = {}));

function compare() {
  const {
    help,
    args: argHelp
  } = (0, _i18n.getFunctionHelp)().compare;
  const errors = (0, _i18n.getFunctionErrors)().compare;
  return {
    name: 'compare',
    help,
    aliases: ['condition'],
    type: 'boolean',
    inputTypes: ['string', 'number', 'boolean', 'null'],
    args: {
      op: {
        aliases: ['_'],
        types: ['string'],
        default: 'eq',
        help: argHelp.op,
        options: Object.values(Operation)
      },
      to: {
        aliases: ['this', 'b'],
        help: argHelp.to
      }
    },
    fn: (input, args) => {
      const a = input;
      const {
        to: b,
        op
      } = args;
      const typesMatch = typeof a === typeof b;

      switch (op) {
        case Operation.EQ:
          return a === b;

        case Operation.NE:
        case Operation.NEQ:
          return a !== b;

        case Operation.LT:
          if (typesMatch) {
            // @ts-expect-error #35433 This is a wonky comparison for nulls
            return a < b;
          }

          return false;

        case Operation.LTE:
          if (typesMatch) {
            // @ts-expect-error #35433 This is a wonky comparison for nulls
            return a <= b;
          }

          return false;

        case Operation.GT:
          if (typesMatch) {
            // @ts-expect-error #35433 This is a wonky comparison for nulls
            return a > b;
          }

          return false;

        case Operation.GTE:
          if (typesMatch) {
            // @ts-expect-error #35433 This is a wonky comparison for nulls
            return a >= b;
          }

          return false;

        default:
          throw errors.invalidCompareOperator(op, Object.values(Operation).join(', '));
      }
    }
  };
}