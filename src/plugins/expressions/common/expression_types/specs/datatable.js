"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.datatable = exports.isDatatable = void 0;

var _lodash = require("lodash");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const name = 'datatable';
/**
 * A Utility function that Typescript can use to determine if an object is a Datatable.
 * @param datatable
 */

const isDatatable = datatable => !!datatable && typeof datatable === 'object' && datatable.type === 'datatable';
/**
 * This type represents the `type` of any `DatatableColumn` in a `Datatable`.
 * its duplicated from KBN_FIELD_TYPES
 */


exports.isDatatable = isDatatable;
const datatable = {
  name,
  validate: table => {
    // TODO: Check columns types. Only string, boolean, number, date, allowed for now.
    if (!table.columns) {
      throw new Error('datatable must have a columns array, even if it is empty');
    }

    if (!table.rows) {
      throw new Error('datatable must have a rows array, even if it is empty');
    }
  },
  serialize: table => {
    const {
      columns,
      rows
    } = table;
    return { ...table,
      rows: rows.map(row => {
        return columns.map(column => row[column.name]);
      })
    };
  },
  deserialize: table => {
    const {
      columns,
      rows
    } = table;
    return { ...table,
      rows: rows.map(row => {
        return (0, _lodash.zipObject)((0, _lodash.map)(columns, 'name'), row);
      })
    };
  },
  from: {
    null: () => ({
      type: name,
      meta: {},
      rows: [],
      columns: []
    }),
    pointseries: value => ({
      type: name,
      meta: {},
      rows: value.rows,
      columns: (0, _lodash.map)(value.columns, (val, colName) => {
        return {
          id: colName,
          name: colName,
          meta: {
            type: val.type
          }
        };
      })
    })
  },
  to: {
    render: table => ({
      type: 'render',
      as: 'table',
      value: {
        datatable: table,
        paginate: true,
        perPage: 10,
        showHeader: true
      }
    }),
    pointseries: table => {
      const validFields = ['x', 'y', 'color', 'size', 'text'];
      const columns = table.columns.filter(column => validFields.includes(column.id));
      const rows = table.rows.map(row => (0, _lodash.pick)(row, validFields));
      return {
        type: 'pointseries',
        columns: columns.reduce((acc, column) => {
          acc[column.name] = {
            type: column.meta.type,
            expression: column.name,
            role: 'dimension'
          };
          return acc;
        }, {}),
        rows
      };
    }
  }
};
exports.datatable = datatable;