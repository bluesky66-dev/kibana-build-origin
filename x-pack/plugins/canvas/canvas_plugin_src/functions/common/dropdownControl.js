"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dropdownControl = dropdownControl;

var _lodash = require("lodash");

var _i18n = require("../../../i18n");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function dropdownControl() {
  const {
    help,
    args: argHelp
  } = (0, _i18n.getFunctionHelp)().dropdownControl;
  return {
    name: 'dropdownControl',
    aliases: [],
    type: 'render',
    inputTypes: ['datatable'],
    help,
    args: {
      filterColumn: {
        types: ['string'],
        required: true,
        help: argHelp.filterColumn
      },
      labelColumn: {
        types: ['string'],
        required: false,
        help: argHelp.labelColumn
      },
      valueColumn: {
        types: ['string'],
        required: true,
        help: argHelp.valueColumn
      },
      filterGroup: {
        types: ['string'],
        help: argHelp.filterGroup
      }
    },
    fn: (input, {
      valueColumn,
      filterColumn,
      filterGroup,
      labelColumn
    }) => {
      let choices = [];
      const labelCol = labelColumn || valueColumn;
      const filteredRows = input.rows.filter(row => row[valueColumn] !== null && row[valueColumn] !== undefined);

      if (filteredRows.length > 0) {
        choices = filteredRows.map(row => [row[valueColumn], row[labelCol]]);
        choices = (0, _lodash.uniqBy)(choices, choice => choice[0]);
      }

      const column = filterColumn || valueColumn;
      return {
        type: 'render',
        as: 'dropdown_filter',
        value: {
          column,
          choices,
          filterGroup
        }
      };
    }
  };
}