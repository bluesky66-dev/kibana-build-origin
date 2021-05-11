"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.savedVisualization = savedVisualization;

var _expression_types = require("../../expression_types");

var _build_embeddable_filters = require("../../../public/lib/build_embeddable_filters");

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

function savedVisualization() {
  // @ts-ignore elastic/kibana#44822 Disabling pending filters work
  const {
    help,
    args: argHelp
  } = (0, _i18n.getFunctionHelp)().savedVisualization;
  return {
    name: 'savedVisualization',
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
      colors: {
        types: ['seriesStyle'],
        help: argHelp.colors,
        multi: true,
        required: false
      },
      hideLegend: {
        types: ['boolean'],
        help: argHelp.hideLegend,
        required: false
      },
      title: {
        types: ['string'],
        help: argHelp.title,
        required: false
      }
    },
    type: _expression_types.EmbeddableExpressionType,
    fn: (input, {
      id,
      timerange,
      colors,
      hideLegend,
      title
    }) => {
      const filters = input ? input.and : [];
      const visOptions = {};

      if (colors) {
        visOptions.colors = colors.reduce((reduction, color) => {
          if (color.label && color.color) {
            reduction[color.label] = color.color;
          }

          return reduction;
        }, {});
      }

      if (hideLegend === true) {
        // @ts-expect-error LegendOpen missing on VisualizeInput
        visOptions.legendOpen = false;
      }

      return {
        type: _expression_types.EmbeddableExpressionType,
        input: {
          id,
          disableTriggers: true,
          timeRange: timerange || defaultTimeRange,
          filters: (0, _build_embeddable_filters.getQueryFilters)(filters),
          vis: visOptions,
          title: title === null ? undefined : title
        },
        embeddableType: _expression_types.EmbeddableTypes.visualization,
        generatedAt: Date.now()
      };
    }
  };
}