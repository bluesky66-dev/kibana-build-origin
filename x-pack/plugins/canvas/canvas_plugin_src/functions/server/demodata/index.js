"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.demodata = demodata;

var _lodash = require("lodash");

var _query = require("../../../../common/lib/datatable/query");

var _demo_rows_types = require("./demo_rows_types");

var _get_demo_rows = require("./get_demo_rows");

var _i18n = require("../../../../i18n");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// @ts-expect-error unconverted lib file


function demodata() {
  const {
    help,
    args: argHelp
  } = (0, _i18n.getFunctionHelp)().demodata;
  return {
    name: 'demodata',
    aliases: [],
    type: 'datatable',
    context: {
      types: ['filter']
    },
    help,
    args: {
      type: {
        types: ['string'],
        aliases: ['_'],
        help: argHelp.type,
        default: 'ci',
        options: ['ci', 'shirts']
      }
    },
    fn: (input, args) => {
      const demoRows = (0, _get_demo_rows.getDemoRows)(args.type);
      let set = {};

      if (args.type === _demo_rows_types.DemoRows.CI) {
        set = {
          columns: [{
            id: '@timestamp',
            name: '@timestamp',
            meta: {
              type: 'date'
            }
          }, {
            id: 'time',
            name: 'time',
            meta: {
              type: 'date'
            }
          }, {
            id: 'cost',
            name: 'cost',
            meta: {
              type: 'number'
            }
          }, {
            id: 'username',
            name: 'username',
            meta: {
              type: 'string'
            }
          }, {
            id: 'price',
            name: 'price',
            meta: {
              type: 'number'
            }
          }, {
            id: 'age',
            name: 'age',
            meta: {
              type: 'number'
            }
          }, {
            id: 'country',
            name: 'country',
            meta: {
              type: 'string'
            }
          }, {
            id: 'state',
            name: 'state',
            meta: {
              type: 'string'
            }
          }, {
            id: 'project',
            name: 'project',
            meta: {
              type: 'string'
            }
          }, {
            id: 'percent_uptime',
            name: 'percent_uptime',
            meta: {
              type: 'number'
            }
          }],
          // @ts-expect-error invalid json mock
          rows: (0, _lodash.sortBy)(demoRows, 'time')
        };
      } else if (args.type === _demo_rows_types.DemoRows.SHIRTS) {
        set = {
          columns: [{
            id: 'size',
            name: 'size',
            meta: {
              type: 'string'
            }
          }, {
            id: 'color',
            name: 'color',
            meta: {
              type: 'string'
            }
          }, {
            id: 'price',
            name: 'price',
            meta: {
              type: 'number'
            }
          }, {
            id: 'cut',
            name: 'cut',
            meta: {
              type: 'string'
            }
          }],
          rows: demoRows
        };
      }

      const {
        columns,
        rows
      } = set;
      return (0, _query.queryDatatable)({
        type: 'datatable',
        columns,
        rows
      }, input);
    }
  };
}