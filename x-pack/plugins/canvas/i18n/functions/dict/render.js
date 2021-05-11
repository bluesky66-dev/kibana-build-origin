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
  help: _i18n.i18n.translate('xpack.canvas.functions.renderHelpText', {
    defaultMessage: 'Renders the {CONTEXT} as a specific element and sets element level options, such as background and border styling.',
    values: {
      CONTEXT: _constants.CONTEXT
    }
  }),
  args: {
    as: _i18n.i18n.translate('xpack.canvas.functions.render.args.asHelpText', {
      defaultMessage: 'The element type to render. You probably want a specialized function instead, such as {plotFn} or {shapeFn}.',
      values: {
        plotFn: '`plot`',
        shapeFn: '`shape`'
      }
    }),
    css: _i18n.i18n.translate('xpack.canvas.functions.render.args.cssHelpText', {
      defaultMessage: 'Any block of custom {CSS} to be scoped to the element.',
      values: {
        CSS: _constants.CSS
      }
    }),
    containerStyle: _i18n.i18n.translate('xpack.canvas.functions.render.args.containerStyleHelpText', {
      defaultMessage: 'The style for the container, including background, border, and opacity.'
    })
  }
};
exports.help = help;