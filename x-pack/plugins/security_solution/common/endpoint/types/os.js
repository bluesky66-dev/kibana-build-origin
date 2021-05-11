"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.OperatingSystem = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

let OperatingSystem;
exports.OperatingSystem = OperatingSystem;

(function (OperatingSystem) {
  OperatingSystem["LINUX"] = "linux";
  OperatingSystem["MAC"] = "macos";
  OperatingSystem["WINDOWS"] = "windows";
})(OperatingSystem || (exports.OperatingSystem = OperatingSystem = {}));