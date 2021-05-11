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
  help: _i18n.i18n.translate('xpack.canvas.functions.savedMapHelpText', {
    defaultMessage: `Returns an embeddable for a saved map object.`
  }),
  args: {
    id: _i18n.i18n.translate('xpack.canvas.functions.savedMap.args.idHelpText', {
      defaultMessage: `The ID of the saved map object`
    }),
    center: _i18n.i18n.translate('xpack.canvas.functions.savedMap.args.centerHelpText', {
      defaultMessage: `The center and zoom level the map should have`
    }),
    hideLayer: _i18n.i18n.translate('xpack.canvas.functions.savedMap.args.hideLayer', {
      defaultMessage: `The IDs of map layers that should be hidden`
    }),
    timerange: _i18n.i18n.translate('xpack.canvas.functions.savedMap.args.timerangeHelpText', {
      defaultMessage: `The timerange of data that should be included`
    }),
    title: _i18n.i18n.translate('xpack.canvas.functions.savedMap.args.titleHelpText', {
      defaultMessage: `The title for the map`
    })
  }
};
exports.help = help;