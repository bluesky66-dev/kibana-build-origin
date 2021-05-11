"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.urlparam = urlparam;

var _url = require("url");

var _i18n = require("../../../i18n");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function urlparam() {
  const {
    help,
    args: argHelp
  } = (0, _i18n.getFunctionHelp)().urlparam;
  return {
    name: 'urlparam',
    aliases: [],
    type: 'string',
    help,
    inputTypes: ['null'],
    args: {
      param: {
        types: ['string'],
        aliases: ['_', 'var', 'variable'],
        help: argHelp.param,
        multi: false,
        required: true
      },
      default: {
        types: ['string'],
        default: '""',
        help: argHelp.default
      }
    },
    fn: (input, args) => {
      const query = (0, _url.parse)(window.location.href, true).query;
      return query[args.param] || args.default;
    }
  };
}