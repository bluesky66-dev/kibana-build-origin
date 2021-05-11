"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.functionTestSpecs = void 0;

var _access = require("./access");

var _add = require("./add");

var _error = require("./error");

var _introspect_context = require("./introspect_context");

var _mult = require("./mult");

var _sleep = require("./sleep");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const functionTestSpecs = [_access.access, _add.add, _error.error, _introspect_context.introspectContext, _mult.mult, _sleep.sleep];
exports.functionTestSpecs = functionTestSpecs;