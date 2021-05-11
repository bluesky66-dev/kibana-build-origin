"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.queryEsSQL = void 0;

var _lodash = require("lodash");

var _build_bool_array = require("./build_bool_array");

var _sanitize_name = require("./sanitize_name");

var _normalize_type = require("./normalize_type");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const queryEsSQL = async (elasticsearchClient, {
  count,
  query,
  filter,
  timezone
}) => {
  try {
    let response = await elasticsearchClient('transport.request', {
      path: '/_sql?format=json',
      method: 'POST',
      body: {
        query,
        time_zone: timezone,
        fetch_size: count,
        client_id: 'canvas',
        filter: {
          bool: {
            must: [{
              match_all: {}
            }, ...(0, _build_bool_array.buildBoolArray)(filter)]
          }
        }
      }
    });
    const columns = response.columns.map(({
      name,
      type
    }) => {
      return {
        id: (0, _sanitize_name.sanitizeName)(name),
        name: (0, _sanitize_name.sanitizeName)(name),
        meta: {
          type: (0, _normalize_type.normalizeType)(type)
        }
      };
    });
    const columnNames = (0, _lodash.map)(columns, 'name');
    let rows = response.rows.map(row => (0, _lodash.zipObject)(columnNames, row));

    while (rows.length < count && response.cursor !== undefined) {
      response = await elasticsearchClient('transport.request', {
        path: '/_sql?format=json',
        method: 'POST',
        body: {
          cursor: response.cursor
        }
      });
      rows = [...rows, ...response.rows.map(row => (0, _lodash.zipObject)(columnNames, row))];
    }

    if (response.cursor !== undefined) {
      elasticsearchClient('transport.request', {
        path: '/_sql/close',
        method: 'POST',
        body: {
          cursor: response.cursor
        }
      });
    }

    return {
      type: 'datatable',
      meta: {
        type: 'essql'
      },
      columns,
      rows
    };
  } catch (e) {
    if (e.message.indexOf('parsing_exception') > -1) {
      throw new Error(`Couldn't parse Elasticsearch SQL query. You may need to add double quotes to names containing special characters. Check your query and try again. Error: ${e.message}`);
    }

    throw new Error(`Unexpected error from Elasticsearch: ${e.message}`);
  }
};

exports.queryEsSQL = queryEsSQL;