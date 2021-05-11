"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isErrorThatHandlesItsOwnResponse = isErrorThatHandlesItsOwnResponse;
Object.defineProperty(exports, "ActionTypeDisabledError", {
  enumerable: true,
  get: function () {
    return _action_type_disabled.ActionTypeDisabledError;
  }
});
Object.defineProperty(exports, "ActionTypeDisabledReason", {
  enumerable: true,
  get: function () {
    return _action_type_disabled.ActionTypeDisabledReason;
  }
});

var _action_type_disabled = require("./action_type_disabled");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function isErrorThatHandlesItsOwnResponse(e) {
  return typeof e.sendResponse === 'function';
}