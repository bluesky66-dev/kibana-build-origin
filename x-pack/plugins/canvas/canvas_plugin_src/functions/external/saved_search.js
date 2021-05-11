"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.savedSearch = savedSearch;

var _expression_types = require("../../expression_types");

var _build_embeddable_filters = require("../../../public/lib/build_embeddable_filters");

var _i18n = require("../../../i18n");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function savedSearch() {
  const {
    help,
    args: argHelp
  } = (0, _i18n.getFunctionHelp)().savedSearch;
  return {
    name: 'savedSearch',
    help,
    args: {
      id: {
        types: ['string'],
        required: false,
        help: argHelp.id
      }
    },
    type: _expression_types.EmbeddableExpressionType,
    fn: (input, {
      id
    }) => {
      const filters = input ? input.and : [];
      return {
        type: _expression_types.EmbeddableExpressionType,
        input: {
          id,
          ...(0, _build_embeddable_filters.buildEmbeddableFilters)(filters)
        },
        embeddableType: _expression_types.EmbeddableTypes.search,
        generatedAt: Date.now()
      };
    }
  };
}