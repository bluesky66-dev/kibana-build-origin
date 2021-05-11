"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.errors = exports.help = void 0;

var _i18n = require("@kbn/i18n");

var _image = require("../../../canvas_plugin_src/functions/common/image");

var _constants = require("../../constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const help = {
  help: _i18n.i18n.translate('xpack.canvas.functions.imageHelpText', {
    defaultMessage: 'Displays an image. Provide an image asset as a {BASE64} data {URL}, or pass in a sub-expression.',
    values: {
      BASE64: _constants.BASE64,
      URL: _constants.URL
    }
  }),
  args: {
    dataurl: _i18n.i18n.translate('xpack.canvas.functions.image.args.dataurlHelpText', {
      defaultMessage: 'The {https} {URL} or {BASE64} data {URL} of an image.',
      values: {
        BASE64: _constants.BASE64,
        https: 'HTTP(S)',
        URL: _constants.URL
      }
    }),
    mode: _i18n.i18n.translate('xpack.canvas.functions.image.args.modeHelpText', {
      defaultMessage: '{contain} shows the entire image, scaled to fit. ' + '{cover} fills the container with the image, cropping from the sides or bottom as needed. ' + '{stretch} resizes the height and width of the image to 100% of the container.',
      values: {
        contain: `\`"${_image.ImageMode.CONTAIN}"\``,
        cover: `\`"${_image.ImageMode.COVER}"\``,
        stretch: `\`"${_image.ImageMode.STRETCH}"\``
      }
    })
  }
};
exports.help = help;
const errors = {
  invalidImageMode: () => new Error(_i18n.i18n.translate('xpack.canvas.functions.image.invalidImageModeErrorMessage', {
    defaultMessage: '"mode" must be "{contain}", "{cover}", or "{stretch}"',
    values: {
      contain: _image.ImageMode.CONTAIN,
      cover: _image.ImageMode.COVER,
      stretch: _image.ImageMode.STRETCH
    }
  }))
};
exports.errors = errors;