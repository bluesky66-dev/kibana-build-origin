"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.uiMixin = uiMixin;

var _ui_render = require("./ui_render");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
async function uiMixin(kbnServer) {
  await kbnServer.mixin(_ui_render.uiRenderMixin);
}