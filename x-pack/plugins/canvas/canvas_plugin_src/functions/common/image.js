"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.image = image;
exports.ImageMode = void 0;

var _i18n = require("../../../i18n");

var _resolve_dataurl = require("../../../common/lib/resolve_dataurl");

var _elastic_logo = require("../../lib/elastic_logo");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// @ts-expect-error untyped local


let ImageMode;
exports.ImageMode = ImageMode;

(function (ImageMode) {
  ImageMode["CONTAIN"] = "contain";
  ImageMode["COVER"] = "cover";
  ImageMode["STRETCH"] = "stretch";
})(ImageMode || (exports.ImageMode = ImageMode = {}));

function image() {
  const {
    help,
    args: argHelp
  } = (0, _i18n.getFunctionHelp)().image;
  const errors = (0, _i18n.getFunctionErrors)().image;
  return {
    name: 'image',
    aliases: [],
    type: 'image',
    inputTypes: ['null'],
    help,
    args: {
      dataurl: {
        // This was accepting dataurl, but there was no facility in fn for checking type and handling a dataurl type.
        types: ['string', 'null'],
        help: argHelp.dataurl,
        aliases: ['_', 'url'],
        default: _elastic_logo.elasticLogo
      },
      mode: {
        types: ['string'],
        help: argHelp.mode,
        default: 'contain',
        options: Object.values(ImageMode)
      }
    },
    fn: (input, {
      dataurl,
      mode
    }) => {
      if (!mode || !Object.values(ImageMode).includes(mode)) {
        throw errors.invalidImageMode();
      }

      const modeStyle = mode === 'stretch' ? '100% 100%' : mode;
      return {
        type: 'image',
        mode: modeStyle,
        dataurl: (0, _resolve_dataurl.resolveWithMissingImage)(dataurl, _elastic_logo.elasticLogo)
      };
    }
  };
}