"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.IS_KIBANA_RELEASE = exports.IS_KIBANA_DISTRIBUTABLE = void 0;

var _utils = require("../../core/server/utils");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const IS_KIBANA_DISTRIBUTABLE = _utils.pkg.build && _utils.pkg.build.distributable === true;
exports.IS_KIBANA_DISTRIBUTABLE = IS_KIBANA_DISTRIBUTABLE;
const IS_KIBANA_RELEASE = _utils.pkg.build && _utils.pkg.build.release === true;
exports.IS_KIBANA_RELEASE = IS_KIBANA_RELEASE;