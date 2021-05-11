"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.essql = essql;

var _query_es_sql = require("../../../server/lib/query_es_sql");

var _i18n = require("../../../i18n");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/* eslint-disable */


function essql() {
  const {
    help,
    args: argHelp
  } = (0, _i18n.getFunctionHelp)().essql;
  return {
    name: 'essql',
    type: 'datatable',
    context: {
      types: ['filter']
    },
    help,
    args: {
      query: {
        aliases: ['_', 'q'],
        types: ['string'],
        help: argHelp.query
      },
      count: {
        types: ['number'],
        help: argHelp.count,
        default: 1000
      },
      timezone: {
        aliases: ['tz'],
        types: ['string'],
        default: 'UTC',
        help: argHelp.timezone
      }
    },
    fn: (input, args, context) => {
      return (0, _query_es_sql.queryEsSQL)(context.elasticsearchClient, { ...args,
        filter: input.and
      });
    }
  };
}