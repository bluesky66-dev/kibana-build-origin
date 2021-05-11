"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.containerStyle = containerStyle;

var _types = require("../../../types");

var _i18n = require("../../../i18n");

var _url = require("../../../common/lib/url");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function containerStyle() {
  const {
    help,
    args: argHelp
  } = (0, _i18n.getFunctionHelp)().containerStyle;
  const errors = (0, _i18n.getFunctionErrors)().containerStyle;
  return {
    name: 'containerStyle',
    aliases: [],
    type: 'containerStyle',
    inputTypes: ['null'],
    help,
    args: {
      backgroundColor: {
        types: ['string'],
        help: argHelp.backgroundColor
      },
      backgroundImage: {
        types: ['string'],
        help: argHelp.backgroundImage
      },
      backgroundRepeat: {
        types: ['string'],
        help: argHelp.backgroundRepeat,
        default: 'no-repeat',
        options: Object.values(_types.BackgroundRepeat)
      },
      backgroundSize: {
        types: ['string'],
        help: argHelp.backgroundSize,
        default: 'contain',
        options: Object.values(_types.BackgroundSize)
      },
      border: {
        types: ['string'],
        help: argHelp.border
      },
      borderRadius: {
        types: ['string'],
        help: argHelp.borderRadius
      },
      opacity: {
        types: ['number'],
        help: argHelp.opacity
      },
      overflow: {
        types: ['string'],
        help: argHelp.overflow,
        options: Object.values(_types.Overflow),
        default: 'hidden'
      },
      padding: {
        types: ['string'],
        help: argHelp.padding
      }
    },
    fn: (input, args) => {
      const {
        backgroundImage,
        backgroundSize,
        backgroundRepeat,
        ...remainingArgs
      } = args;
      const style = {
        type: 'containerStyle',
        ...remainingArgs
      };

      if (backgroundImage) {
        if (!(0, _url.isValidUrl)(backgroundImage)) {
          throw errors.invalidBackgroundImage();
        }

        style.backgroundImage = `url(${backgroundImage})`;
        style.backgroundSize = backgroundSize;
        style.backgroundRepeat = backgroundRepeat;
      } // removes keys with undefined value


      return JSON.parse(JSON.stringify(style));
    }
  };
}