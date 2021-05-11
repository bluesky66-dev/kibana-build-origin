"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.help = void 0;

var _i18n = require("@kbn/i18n");

var _constants = require("../../constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const help = {
  help: _i18n.i18n.translate('xpack.canvas.functions.repeatImageHelpText', {
    defaultMessage: 'Configures a repeating image element.'
  }),
  args: {
    emptyImage: _i18n.i18n.translate('xpack.canvas.functions.repeatImage.args.emptyImageHelpText', {
      defaultMessage: 'Fills the difference between the {CONTEXT} and {maxArg} parameter for the element with this image. ' + 'Provide an image asset as a {BASE64} data {URL}, or pass in a sub-expression.',
      values: {
        BASE64: _constants.BASE64,
        CONTEXT: _constants.CONTEXT,
        maxArg: '`max`',
        URL: _constants.URL
      }
    }),
    image: _i18n.i18n.translate('xpack.canvas.functions.repeatImage.args.imageHelpText', {
      defaultMessage: 'The image to repeat. Provide an image asset as a {BASE64} data {URL}, or pass in a sub-expression.',
      values: {
        BASE64: _constants.BASE64,
        URL: _constants.URL
      }
    }),
    max: _i18n.i18n.translate('xpack.canvas.functions.repeatImage.args.maxHelpText', {
      defaultMessage: 'The maximum number of times the image can repeat.'
    }),
    size: _i18n.i18n.translate('xpack.canvas.functions.repeatImage.args.sizeHelpText', {
      defaultMessage: 'The maximum height or width of the image, in pixels. ' + 'When the image is taller than it is wide, this function limits the height.'
    })
  }
};
exports.help = help;