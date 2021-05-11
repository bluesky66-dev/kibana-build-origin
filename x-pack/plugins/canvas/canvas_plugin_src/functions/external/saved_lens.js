"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.savedLens = savedLens;

var _build_embeddable_filters = require("../../../public/lib/build_embeddable_filters");

var _expression_types = require("../../expression_types");

var _i18n = require("../../../i18n");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const defaultTimeRange = {
  from: 'now-15m',
  to: 'now'
};

function savedLens() {
  const {
    help,
    args: argHelp
  } = (0, _i18n.getFunctionHelp)().savedLens;
  return {
    name: 'savedLens',
    help,
    args: {
      id: {
        types: ['string'],
        required: false,
        help: argHelp.id
      },
      timerange: {
        types: ['timerange'],
        help: argHelp.timerange,
        required: false
      },
      title: {
        types: ['string'],
        help: argHelp.title,
        required: false
      },
      palette: {
        types: ['palette'],
        help: argHelp.palette,
        required: false
      }
    },
    type: _expression_types.EmbeddableExpressionType,
    fn: (input, args) => {
      const filters = input ? input.and : [];
      return {
        type: _expression_types.EmbeddableExpressionType,
        input: {
          id: args.id,
          filters: (0, _build_embeddable_filters.getQueryFilters)(filters),
          timeRange: args.timerange || defaultTimeRange,
          title: args.title === null ? undefined : args.title,
          disableTriggers: true,
          palette: args.palette,
          renderMode: 'noInteractivity'
        },
        embeddableType: _expression_types.EmbeddableTypes.lens,
        generatedAt: Date.now()
      };
    }
  };
}