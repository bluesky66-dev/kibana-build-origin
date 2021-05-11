"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.report = void 0;

var _eui = require("@elastic/eui");

var _i18n = require("../../../i18n");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const euiVisPalette = (0, _eui.euiPaletteColorBlind)();

const report = () => ({
  name: _i18n.TagStrings.report(),
  color: euiVisPalette[2]
});

exports.report = report;