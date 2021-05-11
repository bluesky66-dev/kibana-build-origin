"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.savedMap = savedMap;

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

function savedMap() {
  const {
    help,
    args: argHelp
  } = (0, _i18n.getFunctionHelp)().savedMap;
  return {
    name: 'savedMap',
    help,
    args: {
      id: {
        types: ['string'],
        required: false,
        help: argHelp.id
      },
      center: {
        types: ['mapCenter'],
        help: argHelp.center,
        required: false
      },
      hideLayer: {
        types: ['string'],
        help: argHelp.hideLayer,
        required: false,
        multi: true
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
      }
    },
    type: _expression_types.EmbeddableExpressionType,
    fn: (input, args) => {
      const filters = input ? input.and : [];
      const center = args.center ? {
        lat: args.center.lat,
        lon: args.center.lon,
        zoom: args.center.zoom
      } : undefined;
      return {
        type: _expression_types.EmbeddableExpressionType,
        input: {
          attributes: {
            title: ''
          },
          id: args.id,
          filters: (0, _build_embeddable_filters.getQueryFilters)(filters),
          timeRange: args.timerange || defaultTimeRange,
          refreshConfig: {
            pause: false,
            value: 0
          },
          mapCenter: center,
          hideFilterActions: true,
          title: args.title === null ? undefined : args.title,
          isLayerTOCOpen: false,
          hiddenLayers: args.hideLayer || []
        },
        embeddableType: _expression_types.EmbeddableTypes.map,
        generatedAt: Date.now()
      };
    }
  };
}