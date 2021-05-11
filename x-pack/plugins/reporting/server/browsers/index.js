"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "chromium", {
  enumerable: true,
  get: function () {
    return _chromium.chromium;
  }
});
Object.defineProperty(exports, "HeadlessChromiumDriver", {
  enumerable: true,
  get: function () {
    return _driver.HeadlessChromiumDriver;
  }
});
Object.defineProperty(exports, "HeadlessChromiumDriverFactory", {
  enumerable: true,
  get: function () {
    return _driver_factory.HeadlessChromiumDriverFactory;
  }
});
exports.initializeBrowserDriverFactory = void 0;

var _operators = require("rxjs/operators");

var _chromium = require("./chromium");

var _install = require("./install");

var _driver = require("./chromium/driver");

var _driver_factory = require("./chromium/driver_factory");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const initializeBrowserDriverFactory = async (config, logger) => {
  const {
    binaryPath$
  } = (0, _install.installBrowser)(logger);
  const binaryPath = await binaryPath$.pipe((0, _operators.first)()).toPromise();
  const captureConfig = config.get('capture');
  return _chromium.chromium.createDriverFactory(binaryPath, captureConfig, logger);
};

exports.initializeBrowserDriverFactory = initializeBrowserDriverFactory;