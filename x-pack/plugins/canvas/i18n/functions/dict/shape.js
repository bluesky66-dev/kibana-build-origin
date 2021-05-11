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
  help: _i18n.i18n.translate('xpack.canvas.functions.shapeHelpText', {
    defaultMessage: 'Creates a shape.'
  }),
  args: {
    shape: _i18n.i18n.translate('xpack.canvas.functions.shape.args.shapeHelpText', {
      defaultMessage: 'Pick a shape.'
    }),
    border: _i18n.i18n.translate('xpack.canvas.functions.shape.args.borderHelpText', {
      defaultMessage: 'An {SVG} color for the border outlining the shape.',
      values: {
        SVG: _constants.SVG
      }
    }),
    borderWidth: _i18n.i18n.translate('xpack.canvas.functions.shape.args.borderWidthHelpText', {
      defaultMessage: 'The thickness of the border.'
    }),
    fill: _i18n.i18n.translate('xpack.canvas.functions.shape.args.fillHelpText', {
      defaultMessage: 'An {SVG} color to fill the shape.',
      values: {
        SVG: _constants.SVG
      }
    }),
    maintainAspect: _i18n.i18n.translate('xpack.canvas.functions.shape.args.maintainAspectHelpText', {
      defaultMessage: `Maintain the shape's original aspect ratio?`
    })
  }
};
exports.help = help;