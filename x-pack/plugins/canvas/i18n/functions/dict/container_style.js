"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.errors = exports.help = void 0;

var _i18n = require("@kbn/i18n");

var _constants = require("../../constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const help = {
  help: _i18n.i18n.translate('xpack.canvas.functions.containerStyleHelpText', {
    defaultMessage: `Creates an object used for styling an element's container, including background, border, and opacity.`
  }),
  args: {
    backgroundColor: _i18n.i18n.translate('xpack.canvas.functions.containerStyle.args.backgroundColorHelpText', {
      defaultMessage: 'A valid {CSS} background color.',
      values: {
        CSS: _constants.CSS
      }
    }),
    backgroundImage: _i18n.i18n.translate('xpack.canvas.functions.containerStyle.args.backgroundImageHelpText', {
      defaultMessage: 'A valid {CSS} background image.',
      values: {
        CSS: _constants.CSS
      }
    }),
    backgroundRepeat: _i18n.i18n.translate('xpack.canvas.functions.containerStyle.args.backgroundRepeatHelpText', {
      defaultMessage: 'A valid {CSS} background repeat.',
      values: {
        CSS: _constants.CSS
      }
    }),
    backgroundSize: _i18n.i18n.translate('xpack.canvas.functions.containerStyle.args.backgroundSizeHelpText', {
      defaultMessage: 'A valid {CSS} background size.',
      values: {
        CSS: _constants.CSS
      }
    }),
    border: _i18n.i18n.translate('xpack.canvas.functions.containerStyle.args.borderHelpText', {
      defaultMessage: 'A valid {CSS} border.',
      values: {
        CSS: _constants.CSS
      }
    }),
    borderRadius: _i18n.i18n.translate('xpack.canvas.functions.containerStyle.args.borderRadiusHelpText', {
      defaultMessage: 'The number of pixels to use when rounding the corners.'
    }),
    opacity: _i18n.i18n.translate('xpack.canvas.functions.containerStyle.args.opacityHelpText', {
      defaultMessage: 'A number between 0 and 1 that represents the degree of transparency of the element.'
    }),
    overflow: _i18n.i18n.translate('xpack.canvas.functions.containerStyle.args.overflowHelpText', {
      defaultMessage: 'A valid {CSS} overflow.',
      values: {
        CSS: _constants.CSS
      }
    }),
    padding: _i18n.i18n.translate('xpack.canvas.functions.containerStyle.args.paddingHelpText', {
      defaultMessage: 'The distance of the content, in pixels, from the border.'
    })
  }
};
exports.help = help;
const errors = {
  invalidBackgroundImage: () => new Error(_i18n.i18n.translate('xpack.canvas.functions.containerStyle.invalidBackgroundImageErrorMessage', {
    defaultMessage: 'Invalid backgroundImage. Please provide an asset or a URL.'
  }))
};
exports.errors = errors;