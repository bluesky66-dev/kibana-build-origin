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
  help: _i18n.i18n.translate('xpack.canvas.functions.mapCenterHelpText', {
    defaultMessage: `Returns an object with the center coordinates and zoom level of the map.`
  }),
  args: {
    lat: _i18n.i18n.translate('xpack.canvas.functions.mapCenter.args.latHelpText', {
      defaultMessage: `Latitude for the center of the map`
    }),
    lon: _i18n.i18n.translate('xpack.canvas.functions.savedMap.args.lonHelpText', {
      defaultMessage: `Longitude for the center of the map`
    }),
    zoom: _i18n.i18n.translate('xpack.canvas.functions.savedMap.args.zoomHelpText', {
      defaultMessage: `Zoom level of the map`
    })
  }
};
exports.help = help;