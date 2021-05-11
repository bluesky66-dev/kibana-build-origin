"use strict";

var _addonActions = require("@storybook/addon-actions");

var _stubs = require("../public/services/stubs");

var _decorators = require("./decorators");

require("./dll_contexts");

require("../public/style/index.scss");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// Import the modules from the DLL.
// Import Canvas CSS


(0, _stubs.startServices)({
  notify: {
    success: message => (0, _addonActions.action)(`success: ${message}`)(),
    error: message => (0, _addonActions.action)(`error: ${message}`)(),
    info: message => (0, _addonActions.action)(`info: ${message}`)(),
    warning: message => (0, _addonActions.action)(`warning: ${message}`)()
  }
});
(0, _decorators.addDecorators)();