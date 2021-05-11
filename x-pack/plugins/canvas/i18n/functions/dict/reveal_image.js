"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.errors = exports.help = void 0;

var _i18n = require("@kbn/i18n");

var _types = require("../../../types");

var _constants = require("../../constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const help = {
  help: _i18n.i18n.translate('xpack.canvas.functions.revealImageHelpText', {
    defaultMessage: 'Configures an image reveal element.'
  }),
  args: {
    image: _i18n.i18n.translate('xpack.canvas.functions.revealImage.args.imageHelpText', {
      defaultMessage: 'The image to reveal. Provide an image asset as a {BASE64} data {URL}, ' + 'or pass in a sub-expression.',
      values: {
        BASE64: _constants.BASE64,
        URL: _constants.URL
      }
    }),
    emptyImage: _i18n.i18n.translate('xpack.canvas.functions.revealImage.args.emptyImageHelpText', {
      defaultMessage: 'An optional background image to reveal over. ' + 'Provide an image asset as a `{BASE64}` data {URL}, or pass in a sub-expression.',
      values: {
        BASE64: _constants.BASE64,
        URL: _constants.URL
      }
    }),
    origin: _i18n.i18n.translate('xpack.canvas.functions.revealImage.args.originHelpText', {
      defaultMessage: 'The position to start the image fill. For example, {list}, or {end}.',
      values: {
        list: Object.values(_types.Position).slice(0, -1).map(position => `\`"${position}"\``).join(', '),
        end: Object.values(_types.Position).slice(-1)[0]
      }
    })
  }
};
exports.help = help;
const errors = {
  invalidPercent: percent => new Error(_i18n.i18n.translate('xpack.canvas.functions.revealImage.invalidPercentErrorMessage', {
    defaultMessage: "Invalid value: '{percent}'. Percentage must be between 0 and 1",
    values: {
      percent
    }
  }))
};
exports.errors = errors;