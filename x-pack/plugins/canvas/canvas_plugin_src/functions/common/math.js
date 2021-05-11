"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.math = math;

var _tinymath = require("@kbn/tinymath");

var _pivot_object_array = require("../../../common/lib/pivot_object_array");

var _types = require("../../../types");

var _i18n = require("../../../i18n");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function math() {
  const {
    help,
    args: argHelp
  } = (0, _i18n.getFunctionHelp)().math;
  const errors = (0, _i18n.getFunctionErrors)().math;
  return {
    name: 'math',
    type: 'number',
    inputTypes: ['number', 'datatable'],
    help,
    args: {
      expression: {
        aliases: ['_'],
        types: ['string'],
        help: argHelp.expression
      }
    },
    fn: (input, args) => {
      const {
        expression
      } = args;

      if (!expression || expression.trim() === '') {
        throw errors.emptyExpression();
      }

      const mathContext = (0, _types.isDatatable)(input) ? (0, _pivot_object_array.pivotObjectArray)(input.rows, input.columns.map(col => col.name)) : {
        value: input
      };

      try {
        const result = (0, _tinymath.evaluate)(expression, mathContext);

        if (Array.isArray(result)) {
          if (result.length === 1) {
            return result[0];
          }

          throw errors.tooManyResults();
        }

        if (isNaN(result)) {
          throw errors.executionFailed();
        }

        return result;
      } catch (e) {
        if ((0, _types.isDatatable)(input) && input.rows.length === 0) {
          throw errors.emptyDatatable();
        } else {
          throw e;
        }
      }
    }
  };
}