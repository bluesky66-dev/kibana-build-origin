"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.esdocs = esdocs;

var _squel = _interopRequireDefault(require("squel"));

var _query_es_sql = require("../../../server/lib/query_es_sql");

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

/* eslint-disable */


function esdocs() {
  const {
    help,
    args: argHelp
  } = (0, _i18n.getFunctionHelp)().esdocs;
  return {
    name: 'esdocs',
    type: 'datatable',
    context: {
      types: ['filter']
    },
    help,
    args: {
      query: {
        types: ['string'],
        aliases: ['_', 'q'],
        help: argHelp.query,
        default: '-_index:.kibana'
      },
      count: {
        types: ['number'],
        default: 1000,
        help: argHelp.count
      },
      fields: {
        help: argHelp.fields,
        types: ['string']
      },
      index: {
        types: ['string'],
        default: '_all',
        help: argHelp.index
      },
      // TODO: This arg isn't being used in the function.
      // We need to restore this functionality or remove it as an arg.
      metaFields: {
        help: argHelp.metaFields,
        types: ['string']
      },
      sort: {
        types: ['string'],
        help: argHelp.sort
      }
    },
    fn: (input, args, context) => {
      const {
        count,
        index,
        fields,
        sort
      } = args;
      input.and = input.and.concat([{
        type: 'filter',
        filterType: 'luceneQueryString',
        query: args.query,
        and: []
      }]);

      let query = _squel.default.select({
        autoQuoteTableNames: true,
        autoQuoteFieldNames: true,
        autoQuoteAliasNames: true,
        nameQuoteCharacter: '"'
      });

      if (index) {
        query.from(index);
      }

      if (fields) {
        const allFields = fields.split(',').map(field => field.trim());
        allFields.forEach(field => query = query.field(field));
      }

      if (sort) {
        const [sortField, sortOrder] = sort.split(',').map(str => str.trim());

        if (sortField) {
          query.order(`"${sortField}"`, sortOrder === 'asc');
        }
      }

      return (0, _query_es_sql.queryEsSQL)(context.elasticsearchClient, {
        count,
        query: query.toString(),
        filter: input.and
      });
    }
  };
}