"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDisallowedOutgoingUrlError = exports.getChromiumDisconnectedError = exports.chromium = void 0;

var _i18n = require("@kbn/i18n");

var _driver_factory = require("./driver_factory");

var _paths = require("./paths");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const chromium = {
  paths: _paths.paths,
  createDriverFactory: (binaryPath, captureConfig, logger) => new _driver_factory.HeadlessChromiumDriverFactory(binaryPath, captureConfig, logger)
};
exports.chromium = chromium;

const getChromiumDisconnectedError = () => new Error(_i18n.i18n.translate('xpack.reporting.screencapture.browserWasClosed', {
  defaultMessage: 'Browser was closed unexpectedly! Check the server logs for more info.'
}));

exports.getChromiumDisconnectedError = getChromiumDisconnectedError;

const getDisallowedOutgoingUrlError = interceptedUrl => new Error(_i18n.i18n.translate('xpack.reporting.chromiumDriver.disallowedOutgoingUrl', {
  defaultMessage: `Received disallowed outgoing URL: "{interceptedUrl}". Failing the request and closing the browser.`,
  values: {
    interceptedUrl
  }
}));

exports.getDisallowedOutgoingUrlError = getDisallowedOutgoingUrlError;