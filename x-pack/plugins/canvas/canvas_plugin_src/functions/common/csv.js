"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.csv = csv;

var _papaparse = _interopRequireDefault(require("papaparse"));

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


function csv() {
  const {
    help,
    args: argHelp
  } = (0, _i18n.getFunctionHelp)().csv;
  const errorMessages = (0, _i18n.getFunctionErrors)().csv;
  return {
    name: 'csv',
    type: 'datatable',
    inputTypes: ['null'],
    help,
    args: {
      data: {
        aliases: ['_'],
        types: ['string'],
        required: true,
        help: argHelp.data
      },
      delimiter: {
        types: ['string'],
        help: argHelp.delimiter
      },
      newline: {
        types: ['string'],
        help: argHelp.newline
      }
    },

    fn(input, args) {
      const {
        data: csvString,
        delimiter,
        newline
      } = args;
      const config = {
        transform: val => {
          if (val.indexOf('"') >= 0) {
            return val.trim().replace(/(^\"|\"$)/g, '');
          }

          return val;
        }
      };

      if (delimiter != null) {
        config.delimiter = delimiter;
      }

      if (newline != null) {
        config.newline = newline;
      }

      const output = _papaparse.default.parse(csvString, config);

      const {
        data,
        errors
      } = output;

      if (errors.length > 0) {
        throw errorMessages.invalidInputCSV();
      } // output.data is an array of arrays, rows and values in each row


      return data.reduce((acc, row, i) => {
        if (i === 0) {
          // first row, assume header values
          row.forEach(colName => acc.columns.push({
            name: colName.trim(),
            type: 'string'
          }));
        } else {
          // any other row is a data row
          const rowObj = row.reduce((rowAcc, colValue, j) => {
            const colName = acc.columns[j].name;
            rowAcc[colName] = colValue;
            return rowAcc;
          }, {});
          acc.rows.push(rowObj);
        }

        return acc;
      }, {
        type: 'datatable',
        columns: [],
        rows: []
      });
    }

  };
}