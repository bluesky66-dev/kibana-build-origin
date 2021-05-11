"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AppStateKeys = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

let AppStateKeys;
exports.AppStateKeys = AppStateKeys;

(function (AppStateKeys) {
  AppStateKeys["FULLSCREEN"] = "__fullscreen";
  AppStateKeys["REFRESH_INTERVAL"] = "__refreshInterval";
  AppStateKeys["AUTOPLAY_INTERVAL"] = "__autoplayInterval";
})(AppStateKeys || (exports.AppStateKeys = AppStateKeys = {}));