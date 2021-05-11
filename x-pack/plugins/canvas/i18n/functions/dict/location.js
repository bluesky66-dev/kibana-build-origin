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
  help: _i18n.i18n.translate('xpack.canvas.functions.locationHelpText', {
    defaultMessage: 'Find your current location using the {geolocationAPI} of the browser. ' + 'Performance can vary, but is fairly accurate. ' + 'See {url}. Don’t use {locationFn} if you plan to generate PDFs as this function requires user input.',
    values: {
      geolocationAPI: 'Geolocation API',
      url: 'https://developer.mozilla.org/en-US/docs/Web/API/Navigator/geolocation',
      locationFn: '`location`'
    }
  }),
  args: {}
};
exports.help = help;