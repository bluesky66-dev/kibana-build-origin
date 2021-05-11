"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.progress = progress;
exports.Shape = void 0;

var _lodash = require("lodash");

var _fonts = require("../../../common/lib/fonts");

var _i18n = require("../../../i18n");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


let Shape;
exports.Shape = Shape;

(function (Shape) {
  Shape["GAUGE"] = "gauge";
  Shape["HORIZONTAL_BAR"] = "horizontalBar";
  Shape["HORIZONTAL_PILL"] = "horizontalPill";
  Shape["SEMICIRCLE"] = "semicircle";
  Shape["UNICORN"] = "unicorn";
  Shape["VERTICAL_BAR"] = "verticalBar";
  Shape["VERTICAL_PILL"] = "verticalPill";
  Shape["WHEEL"] = "wheel";
})(Shape || (exports.Shape = Shape = {}));

function progress() {
  const {
    help,
    args: argHelp
  } = (0, _i18n.getFunctionHelp)().progress;
  const errors = (0, _i18n.getFunctionErrors)().progress;
  return {
    name: 'progress',
    aliases: [],
    type: 'render',
    inputTypes: ['number'],
    help,
    args: {
      shape: {
        aliases: ['_'],
        types: ['string'],
        help: argHelp.shape,
        options: Object.values(Shape),
        default: 'gauge'
      },
      barColor: {
        types: ['string'],
        help: argHelp.barColor,
        default: `#f0f0f0`
      },
      barWeight: {
        types: ['number'],
        help: argHelp.barWeight,
        default: 20
      },
      font: {
        types: ['style'],
        help: argHelp.font,
        default: `{font size=24 family="${_fonts.openSans.value}" color="#000000" align=center}`
      },
      label: {
        types: ['boolean', 'string'],
        help: argHelp.label,
        default: true
      },
      max: {
        types: ['number'],
        help: argHelp.max,
        default: 1
      },
      valueColor: {
        types: ['string'],
        help: argHelp.valueColor,
        default: `#1785b0`
      },
      valueWeight: {
        types: ['number'],
        help: argHelp.valueWeight,
        default: 20
      }
    },
    fn: (value, args) => {
      if (args.max <= 0) {
        throw errors.invalidMaxValue(args.max);
      }

      if (value > args.max || value < 0) {
        throw errors.invalidValue(value, args.max);
      }

      let label = '';

      if (args.label) {
        label = typeof args.label === 'string' ? args.label : `${value}`;
      }

      let font = {};

      if ((0, _lodash.get)(args, 'font.spec')) {
        font = { ...args.font
        };
        font.spec.fill = args.font.spec.color; // SVG <text> uses fill for font color
      }

      return {
        type: 'render',
        as: 'progress',
        value: {
          value,
          ...args,
          label,
          font
        }
      };
    }
  };
}