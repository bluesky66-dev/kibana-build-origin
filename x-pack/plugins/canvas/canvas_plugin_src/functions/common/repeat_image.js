"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.repeatImage = repeatImage;

var _resolve_dataurl = require("../../../common/lib/resolve_dataurl");

var _elastic_outline = require("../../lib/elastic_outline");

var _i18n = require("../../../i18n");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// @ts-expect-error untyped local


function repeatImage() {
  const {
    help,
    args: argHelp
  } = (0, _i18n.getFunctionHelp)().repeatImage;
  return {
    name: 'repeatImage',
    aliases: [],
    type: 'render',
    inputTypes: ['number'],
    help,
    args: {
      emptyImage: {
        types: ['string', 'null'],
        help: argHelp.emptyImage,
        default: null
      },
      image: {
        types: ['string', 'null'],
        help: argHelp.image,
        default: _elastic_outline.elasticOutline
      },
      max: {
        types: ['number'],
        help: argHelp.max,
        default: 1000
      },
      size: {
        types: ['number'],
        default: 100,
        help: argHelp.size
      }
    },
    fn: (count, args) => {
      return {
        type: 'render',
        as: 'repeatImage',
        value: {
          count: Math.floor(count),
          ...args,
          image: (0, _resolve_dataurl.resolveWithMissingImage)(args.image, _elastic_outline.elasticOutline),
          emptyImage: (0, _resolve_dataurl.resolveWithMissingImage)(args.emptyImage)
        }
      };
    }
  };
}