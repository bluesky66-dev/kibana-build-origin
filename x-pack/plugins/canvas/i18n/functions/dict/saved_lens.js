"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.help = void 0;

var _i18n = require("@kbn/i18n");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const help = {
  help: _i18n.i18n.translate('xpack.canvas.functions.savedLensHelpText', {
    defaultMessage: `Returns an embeddable for a saved Lens visualization object.`
  }),
  args: {
    id: _i18n.i18n.translate('xpack.canvas.functions.savedLens.args.idHelpText', {
      defaultMessage: `The ID of the saved Lens visualization object`
    }),
    timerange: _i18n.i18n.translate('xpack.canvas.functions.savedLens.args.timerangeHelpText', {
      defaultMessage: `The timerange of data that should be included`
    }),
    title: _i18n.i18n.translate('xpack.canvas.functions.savedLens.args.titleHelpText', {
      defaultMessage: `The title for the Lens visualization object`
    }),
    palette: _i18n.i18n.translate('xpack.canvas.functions.savedLens.args.paletteHelpText', {
      defaultMessage: `The palette used for the Lens visualization`
    })
  }
};
exports.help = help;