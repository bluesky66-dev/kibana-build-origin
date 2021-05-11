"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.render = render;

var _i18n = require("../../../i18n");

var _constants = require("../../../common/lib/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function render() {
  const {
    help,
    args: argHelp
  } = (0, _i18n.getFunctionHelp)().render;
  return {
    name: 'render',
    aliases: [],
    type: 'render',
    inputTypes: ['render'],
    help,
    args: {
      as: {
        types: ['string'],
        help: argHelp.as,
        options: ['advanced_filter', 'debug', 'dropdown_filter', 'error', 'image', 'markdown', 'metric', 'pie', 'plot', 'progress', 'repeatImage', 'revealImage', 'shape', 'table', 'time_filter', 'text']
      },
      css: {
        types: ['string'],
        help: argHelp.css,
        default: `"${_constants.DEFAULT_ELEMENT_CSS}"`
      },
      containerStyle: {
        types: ['containerStyle'],
        help: argHelp.containerStyle,
        default: '{containerStyle}'
      }
    },
    fn: (input, args) => {
      return { ...input,
        as: args.as || input.as,
        css: args.css || _constants.DEFAULT_ELEMENT_CSS,
        containerStyle: args.containerStyle
      };
    }
  };
}