"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "PaletteOutput", {
  enumerable: true,
  get: function () {
    return _common.PaletteOutput;
  }
});
Object.defineProperty(exports, "CustomPaletteArguments", {
  enumerable: true,
  get: function () {
    return _common.CustomPaletteArguments;
  }
});
Object.defineProperty(exports, "CustomPaletteState", {
  enumerable: true,
  get: function () {
    return _common.CustomPaletteState;
  }
});
Object.defineProperty(exports, "SystemPaletteArguments", {
  enumerable: true,
  get: function () {
    return _common.SystemPaletteArguments;
  }
});
Object.defineProperty(exports, "paletteIds", {
  enumerable: true,
  get: function () {
    return _common.paletteIds;
  }
});
exports.plugin = void 0;

var _plugin = require("./plugin");

var _common = require("../common");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const plugin = () => new _plugin.ChartsServerPlugin();

exports.plugin = plugin;