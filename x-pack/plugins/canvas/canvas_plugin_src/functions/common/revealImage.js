"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.revealImage = revealImage;
exports.Origin = void 0;

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


let Origin;
exports.Origin = Origin;

(function (Origin) {
  Origin["TOP"] = "top";
  Origin["LEFT"] = "left";
  Origin["BOTTOM"] = "bottom";
  Origin["RIGHT"] = "right";
})(Origin || (exports.Origin = Origin = {}));

function revealImage() {
  const {
    help,
    args: argHelp
  } = (0, _i18n.getFunctionHelp)().revealImage;
  const errors = (0, _i18n.getFunctionErrors)().revealImage;
  return {
    name: 'revealImage',
    aliases: [],
    type: 'render',
    inputTypes: ['number'],
    help,
    args: {
      image: {
        types: ['string', 'null'],
        help: argHelp.image,
        default: _elastic_outline.elasticOutline
      },
      emptyImage: {
        types: ['string', 'null'],
        help: argHelp.emptyImage,
        default: null
      },
      origin: {
        types: ['string'],
        help: argHelp.origin,
        default: 'bottom',
        options: Object.values(Origin)
      }
    },
    fn: (percent, args) => {
      if (percent > 1 || percent < 0) {
        throw errors.invalidPercent(percent);
      }

      return {
        type: 'render',
        as: 'revealImage',
        value: {
          percent,
          ...args,
          image: (0, _resolve_dataurl.resolveWithMissingImage)(args.image, _elastic_outline.elasticOutline),
          emptyImage: (0, _resolve_dataurl.resolveWithMissingImage)(args.emptyImage)
        }
      };
    }
  };
}